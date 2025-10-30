import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Tenant } from '../tenants/tenant.entity';
  import { WahaSession } from '../waha/waha-session.entity';
  import { ApiProperty } from '@nestjs/swagger';
  import { Conversation } from '../conversations/conversation.entity';

  
  export enum MessageDirection {
    IN = 'IN',
    OUT = 'OUT',
  }
  
  @Entity('messages')
  export class Message {
    @ApiProperty({ example: 'a123e4b5-12cd-4e6f-a1b2-9e5d6f7c8g9h' })
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @ApiProperty({ example: 'tenant-uuid-1234' })
    @Column()
    tenant_id!: string;
  
    @ManyToOne(() => Tenant, (tenant) => tenant.messages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tenant_id' })
    tenant!: Tenant;
  
    @ApiProperty({ example: 'session-uuid-1234' })
    @Column()
    session_id!: string;
  
    @ManyToOne(() => WahaSession, (session) => session.messages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'session_id' })
    session!: WahaSession;
  
    @ApiProperty({ enum: MessageDirection, example: MessageDirection.OUT })
    @Column({ type: 'enum', enum: MessageDirection })
    direction!: MessageDirection;
  
    @ApiProperty({ example: '+919876543210' })
    @Column()
    phone_number!: string;
  
    @ApiProperty({ example: 'Hello from WAHA API!' })
    @Column()
    text!: string;
  
    @ApiProperty({ example: { status: 'SENT' } })
    @Column({ type: 'jsonb', nullable: true })
    raw_json?: Record<string, any>;
  
    @ApiProperty({ example: '2025-10-08T10:12:00.000Z' })
    @CreateDateColumn()
    created_at!: Date;

      @Column({ nullable: true })
  conversation_id?: string;

  @ManyToOne(() => Conversation, (c) => c.messages, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'conversation_id' })
  conversation?: Conversation;

  }
  