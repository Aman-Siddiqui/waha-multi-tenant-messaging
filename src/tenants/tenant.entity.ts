import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { WahaSession } from '../waha/waha-session.entity';
import { Message } from '../messages/message.entity';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => User, (user) => user.tenant)
  users: User[];

  @OneToMany(() => WahaSession, (s) => s.tenant)
  sessions: WahaSession[];

  @OneToMany(() => Message, (m) => m.tenant)
  messages: Message[];
}
