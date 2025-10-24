import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto';
import { JwtAuthGuard } from '../auth//guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from './user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.TENANT_ADMIN)
  async create(@Body() dto: CreateUserDto, @Req() req: any) {
    const tenantId = req.tenantId;
    const newUser = await this.usersService.createUser(dto, tenantId);
    return {
      message: 'User created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        tenant_id: newUser.tenant_id,
      },
    };
  }

  @Get('me')
  async getProfile(@Req() req: any) {
    const userId = req.user.id;
    console.log('Fetching profile for user ID:', req.user);
    return this.usersService.findProfile(userId);
  }
}
