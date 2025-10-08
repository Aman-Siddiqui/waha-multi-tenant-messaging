import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async createUser(dto: CreateUserDto, tenantId: string) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already exists');

    const password_hash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      email: dto.email,
      password_hash,
      role: dto.role,
      tenant_id: tenantId,
    });

    return this.userRepo.save(user);
  }

  async findById(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findProfile(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'email', 'role', 'tenant_id', 'created_at'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
