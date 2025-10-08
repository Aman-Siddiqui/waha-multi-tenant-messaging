import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { Message } from '../messages/message.entity';
import { Tenant } from '../tenants/tenant.entity';
import { WahaSession } from '../waha/waha-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Tenant, WahaSession])],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule {}
