import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
  } from 'typeorm';
  import { Tenant } from '../tenants/tenant.entity';
  import { Message } from '../messages/message.entity'; 
  
  @Entity('waha_sessions')
  export class WahaSession {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @Column()
    tenant_id!: string;
  
    @ManyToOne(() => Tenant, (tenant) => tenant.sessions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tenant_id' })
    tenant!: Tenant;
  
    @Column({ nullable: true })
    external_session_id?: string;
  
    @Column({ default: 'CREATED' })
    status!: string;
  
    @Column({ type: 'jsonb', nullable: true })
    metadata?: Record<string, any>;
  
    @CreateDateColumn()
    created_at!: Date;
  
    @OneToMany(() => Message, (message) => message.session)
    messages!: Message[];
  }
  