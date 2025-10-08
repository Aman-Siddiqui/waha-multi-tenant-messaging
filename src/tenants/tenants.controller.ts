import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Tenants')
@ApiBearerAuth()
@Controller('tenants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TenantsController {
  constructor(private readonly svc: TenantsService) {}

  @Post()
  @Roles(UserRole.PLATFORM_ADMIN)
  async create(@Body() dto: CreateTenantDto) {
    return this.svc.create(dto);
  }

  @Get(':id')
  @Roles(UserRole.TENANT_ADMIN, UserRole.MANAGER, UserRole.AUDITOR)
  async getOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }
}
