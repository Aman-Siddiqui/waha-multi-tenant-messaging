import { DataSource } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import { Tenant } from '../tenants/tenant.entity';
import * as bcrypt from 'bcrypt';

export async function seedTestData(dataSource: DataSource) {
  const tenantRepo = dataSource.getRepository(Tenant);
  const userRepo = dataSource.getRepository(User);

  // 1️⃣ Create demo tenant
  const tenant = tenantRepo.create({ name: 'Acme Corp' });
  await tenantRepo.save(tenant);

  // 2️⃣ Create admin user
  const admin = userRepo.create({
    tenant_id: tenant.id,
    email: 'admin@example.com',
    password_hash: await bcrypt.hash('admin123', 10),
    role: UserRole.TENANT_ADMIN,
  });
  await userRepo.save(admin);
}
