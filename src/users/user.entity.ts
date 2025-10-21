import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Tenant } from '../tenants/tenant.entity';
  
  export enum UserRole {
    PLATFORM_ADMIN = 'PLATFORM_ADMIN', 
    TENANT_ADMIN = 'TENANT_ADMIN',
    MANAGER = 'MANAGER',
    AGENT = 'AGENT',
    AUDITOR = 'AUDITOR',
  }
  
  export { UserRole as Role };
  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ nullable: true })
    tenant_id: string | null;

    @ManyToOne(() => Tenant, (tenant) => tenant.users, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;
  
    @Column({ unique: true })
    email: string;
  
    @Column()
    password_hash: string;
  
    @Column({ type: 'enum', enum: UserRole })
    role: UserRole;
  
    @CreateDateColumn()
    created_at: Date;
  }
  