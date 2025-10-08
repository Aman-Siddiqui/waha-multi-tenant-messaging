import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message, MessageDirection } from '../messages/message.entity';
import { Tenant } from '../tenants/tenant.entity';
import { WahaSession } from '../waha/waha-session.entity';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    @InjectRepository(Message) private messageRepo: Repository<Message>,
    @InjectRepository(Tenant) private tenantRepo: Repository<Tenant>,
    @InjectRepository(WahaSession) private sessionRepo: Repository<WahaSession>,
  ) {}

  async handleInboundMessage(payload: any) {
    try {
    
      const phone = payload?.data?.from || '';
      const text = payload?.data?.body || '';
      const sessionName = payload?.session || 'default';

    
      const session = await this.sessionRepo.findOne({
        where: { external_session_id: sessionName },
      });
      if (!session) {
        this.logger.warn(`No session found for webhook: ${sessionName}`);
        return;
      }

      await this.messageRepo.save({
        tenant_id: session.tenant_id,
        session_id: session.id,
        direction: MessageDirection.IN,
        phone_number: phone,
        text,
        raw_json: payload,
      });

      this.logger.log(`Inbound message saved from ${phone}`);
    } catch (err) {
      this.logger.error('Failed to handle inbound webhook', err);
    }
  }
}
