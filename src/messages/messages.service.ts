import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message, MessageDirection } from './message.entity';
import { WahaService } from '../waha/waha.service';
import { WahaSession } from '../waha/waha-session.entity';

@Injectable()
export class MessagesService {
  private idempotencyCache = new Map<string, boolean>();

  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(WahaSession)
    private readonly sessionRepo: Repository<WahaSession>,
    private readonly wahaService: WahaService,
  ) {}

  async sendMessage(
    tenantId: string,
    phone: string,
    text: string,
    idempotencyKey?: string,
  ) {
    if (idempotencyKey && this.idempotencyCache.has(idempotencyKey)) {
      throw new BadRequestException('Duplicate message request detected');
    }

    if (!/^\+?\d{10,15}$/.test(phone)) {
      throw new BadRequestException('Invalid phone number format');
    }

    const session = await this.sessionRepo.findOne({
      where: { tenant_id: tenantId },
      order: { created_at: 'DESC' },
    });
    if (!session) throw new NotFoundException('No WAHA session found for tenant');

    const msg = this.messageRepo.create({
      tenant_id: tenantId,
      session_id: session.id,
      direction: MessageDirection.OUT,
      phone_number: phone,
      text,
      raw_json: {},
    });
    await this.messageRepo.save(msg);

    try {
      const res = await this.wahaService.sendMessage({
        sessionId: session.external_session_id,
        phone,
        text,
      });
      msg.raw_json = res;
      await this.messageRepo.save(msg);
    } catch (err) {
      msg.raw_json = { error: 'Failed to send via WAHA' };
      await this.messageRepo.save(msg);
      throw new BadRequestException('WAHA message send failed');
    }

    if (idempotencyKey) this.idempotencyCache.set(idempotencyKey, true);
    return msg;
  }

  
  async getMessages(tenantId: string, page = 1, limit = 10) {
    const [data, total] = await this.messageRepo.findAndCount({
      where: { tenant_id: tenantId },
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
