import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AuthModule } from './auth/auth.module';
import { TenantsModule } from './tenants/tenants.module';
import { UsersModule } from './users/users.module';
import { WahaModule } from './waha/waha.module';
import { MessagesModule } from './messages/messages.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { HealthModule } from './health/health.module';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { ConversationsModule } from './conversations/conversations.module';

import { Tenant } from './tenants/tenant.entity';
import { User } from './users/user.entity';
import { WahaSession } from './waha/waha-session.entity';
import { Message } from './messages/message.entity';
import { Conversation } from './conversations/conversation.entity';


@Module({
  imports: [
    
    ConfigModule.forRoot({ isGlobal: true }),

    JwtModule.register({ global: true }),

    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5433'),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Tenant, User, WahaSession, Message, Conversation],
      synchronize: false,
    }),

    
    AuthModule,
    TenantsModule,
    UsersModule,
    WahaModule,
    MessagesModule,
    WebhooksModule,
    HealthModule,
    ConversationsModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
