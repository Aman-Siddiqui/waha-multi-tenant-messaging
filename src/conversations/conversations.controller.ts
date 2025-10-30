import { Controller, Get, Req, Query, Param, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ConversationsService } from './conversations.service';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('conversations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConversationsController {
  constructor(private svc: ConversationsService) {}

  // list assigned to current agent
  @Get('assigned')
  @Roles(UserRole.AGENT)
  async listAssigned(@Req() req, @Query('page') page = '1', @Query('limit') limit = '20') {
    const tenantId = (req as any).tenantId;
    const userId = (req as any).user?.sub || (req as any).user?.id;
    return this.svc.listAssigned(tenantId, userId, Number(page), Number(limit));
  }

  // get messages for conversation
  @Get(':id/messages')
  async getMessages(@Req() req, @Param('id') id: string, @Query('page') page = '1', @Query('limit') limit = '50') {
    const tenantId = (req as any).tenantId;
    const user = (req as any).user || {};
    return this.svc.getConversationMessages(tenantId, id, user.sub || user.id, user.role, Number(page), Number(limit));
  }

  // optional: assign conv to agent (TENANT_ADMIN or MANAGER)
  @Post(':id/assign')
  @Roles(UserRole.TENANT_ADMIN, UserRole.MANAGER)
  async assign(@Req() req, @Param('id') id: string, @Body('assigneeId') assigneeId: string) {
    const tenantId = (req as any).tenantId;
    return this.svc.assign(id, assigneeId, tenantId);
  }


@Post('create')
@Roles(UserRole.TENANT_ADMIN, UserRole.MANAGER)
async create(@Req() req, @Body() body: any) {
  const tenantId = (req as any).tenantId;
  const userId = (req as any).user?.sub || (req as any).user?.id;
  return this.svc.createConversation(
    tenantId,
    userId,
    body.subject,
    body.assigned_to,
  );
}


}
