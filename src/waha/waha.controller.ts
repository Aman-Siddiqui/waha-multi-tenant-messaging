import { Controller, Post, Get, Param, Body, Req, UseGuards } from '@nestjs/common';
import { WahaSessionsService } from './waha-sessions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/user.entity';

@Controller('waha/sessions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WahaController {
  constructor(private readonly wahaSessionsService: WahaSessionsService) {}

  @Post()
  @Roles(Role.TENANT_ADMIN, Role.MANAGER)
  async createSession(@Req() req, @Body('name') name: string) {
    const tenantId = req.user.tenant_id;
    return this.wahaSessionsService.createAndStartSession(tenantId, name);
  }

  @Get()
  @Roles(Role.TENANT_ADMIN, Role.MANAGER, Role.AGENT, Role.AUDITOR)
  async listSessions(@Req() req) {
    const tenantId = req.user.tenant_id;
    return this.wahaSessionsService.listSessions(tenantId);
  }

  @Post(':id/stop')
  @Roles(Role.TENANT_ADMIN, Role.MANAGER)
  async stopSession(@Req() req, @Param('id') id: string) {
    const tenantId = req.user.tenant_id;
    return this.wahaSessionsService.stopSession(tenantId, id);
  }
}
