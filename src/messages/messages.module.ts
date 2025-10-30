import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { WahaSession } from '../waha/waha-session.entity';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { WahaService } from '../waha/waha.service';
import { ConversationsModule } from 'src/conversations/conversations.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message, WahaSession]), ConversationsModule],
  providers: [MessagesService, WahaService],
  controllers: [MessagesController],
})
export class MessagesModule {}
