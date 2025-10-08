import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';
import { User, UserRole } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import dataSource from '../../ormconfig';

async function seed() {
  const ds = await (dataSource as DataSource).initialize();

  console.log('Seeding demo tenant + admin...');
  const tenantRepo = ds.getRepository(Tenant);
  const userRepo = ds.getRepository(User);

  const tenant = tenantRepo.create({ name: 'Demo Tenant' });
  await tenantRepo.save(tenant);

  const hash = await bcrypt.hash('ChangeMe123!', 10);
  const admin = userRepo.create({
    tenant_id: tenant.id,
    email: 'admin@demo.com',
    password_hash: hash,
    role: UserRole.TENANT_ADMIN,
  });
  await userRepo.save(admin);

  console.log('✅ Seed complete.');
  await ds.destroy();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
