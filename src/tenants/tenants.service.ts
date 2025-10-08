import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(@InjectRepository(Tenant) private repo: Repository<Tenant>) {}

  async create(dto: CreateTenantDto) {
    const exists = await this.repo.findOne({ where: { name: dto.name }});
    if (exists) throw new ConflictException('Tenant already exists');
    const t = this.repo.create({ name: dto.name });
    return this.repo.save(t);
  }

  async findOne(id: string) {
    const t = await this.repo.findOne({ where: { id }});
    if (!t) throw new NotFoundException('Tenant not found');
    return t;
  }
}
