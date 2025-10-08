import {
    Controller,
    Post,
    Body,
    Req,
    Headers,
    UseGuards,
    Get,
    Query,
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiTags, ApiQuery, ApiBody } from '@nestjs/swagger';
  import { MessagesService } from './messages.service';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../common/decorators/roles.decorator';
  import { UserRole } from '../users/user.entity';
  import { SendMessageDto } from './send-message.dto';
  
  @ApiTags('Messages')
  @ApiBearerAuth()
  @Controller('messages')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}
  
    @Post('send')
    @Roles(UserRole.AGENT, UserRole.MANAGER, UserRole.TENANT_ADMIN)
    @ApiBody({ type: SendMessageDto })
    async sendMessage(
      @Req() req,
      @Body('phone') phone: string,
      @Body('text') text: string,
      @Headers('idempotency-key') idempotencyKey?: string,
    ) {
      const tenantId = req.user.tenant_id;
      return this.messagesService.sendMessage(tenantId, phone, text, idempotencyKey);
    }
  
    @Get()
    @Roles(UserRole.MANAGER, UserRole.TENANT_ADMIN, UserRole.AUDITOR)
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    async getMessages(@Req() req, @Query('page') page = 1, @Query('limit') limit = 10) {
      const tenantId = req.user.tenant_id;
      return this.messagesService.getMessages(tenantId, page, limit);
    }
  }
  