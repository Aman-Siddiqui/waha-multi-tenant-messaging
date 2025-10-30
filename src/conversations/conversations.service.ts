import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './conversation.entity';
import { Message } from '../messages/message.entity';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation) private convRepo: Repository<Conversation>,
    @InjectRepository(Message) private msgRepo: Repository<Message>,
  ) {}

  // list conversations assigned to user (agent)
  async listAssigned(tenantId: string, userId: string, page = 1, limit = 20) {
    const [data, total] = await this.convRepo.findAndCount({
      where: { tenant_id: tenantId, assigned_to: userId },
      order: { updated_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { total, page, limit, data };
  }

  async getConversationMessages(tenantId: string, convId: string, requesterId: string, requesterRole: string, page = 1, limit = 50) {
    const conv = await this.convRepo.findOne({ where: { id: convId } });
    if (!conv) throw new NotFoundException('Conversation not found');

    // tenant enforcement
    if (conv.tenant_id !== tenantId && requesterRole !== 'PLATFORM_ADMIN') {
      throw new ForbiddenException('Access denied');
    }

    // allow if requester is assignee or manager/tenant_admin/platform_admin
    const allowedRoles = ['PLATFORM_ADMIN', 'TENANT_ADMIN', 'MANAGER'];
    if (conv.assigned_to && conv.assigned_to !== requesterId && !allowedRoles.includes(requesterRole)) {
      throw new ForbiddenException('Not assigned');
    }

    const [messages, total] = await this.msgRepo.findAndCount({
      where: { conversation_id: convId },
      order: { created_at: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { conversation: conv, total, page, limit, messages };
  }

  // helper: find or create conversation by phone + session/tenant
  async findOrCreateByPhone(tenantId: string, phone: string) {
    let conv = await this.convRepo.findOne({ where: { tenant_id: tenantId, phone_number: phone } });
    if (!conv) {
      conv = this.convRepo.create({ tenant_id: tenantId, phone_number: phone, status: 'OPEN' });
      await this.convRepo.save(conv);
    }
    return conv;
  }

  // assign conversation to agent (optional)
  async assign(convId: string, assigneeId: string, tenantId: string) {
    const conv = await this.convRepo.findOne({ where: { id: convId } });
    if (!conv) throw new NotFoundException('Conversation not found');
    if (conv.tenant_id !== tenantId) throw new ForbiddenException('Not your tenant');
    conv.assigned_to = assigneeId;
    return this.convRepo.save(conv);
  }

  async createConversation(tenantId: string, createdBy: string, subject: string, assignedTo: string) {
  const conv = this.convRepo.create({
    tenant_id: tenantId,
    subject,
    created_by: createdBy,
    assigned_to: assignedTo,
  });
  return this.convRepo.save(conv);
}

}
