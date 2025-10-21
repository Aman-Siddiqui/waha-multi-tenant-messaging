import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

import { Tenant } from '../tenants/tenant.entity';
import { User, UserRole } from '../users/user.entity';
import { WahaSession } from '../waha/waha-session.entity';
import { Message } from '../messages/message.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5433', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'root',
  database: process.env.DB_NAME || 'waham',
  entities: [Tenant, User, WahaSession, Message],
  synchronize: false,
  logging: false,
});

async function seed() {
  await AppDataSource.initialize();
  const tenantRepo = AppDataSource.getRepository(Tenant);
  const userRepo = AppDataSource.getRepository(User);
  const sessionRepo = AppDataSource.getRepository(WahaSession);

  console.log('🌱 Starting seeding...');

  
  const platformEmail = 'platform@admin.com';
  const platformExists = await userRepo.findOne({ where: { email: platformEmail } });

  if (!platformExists) {
    const platformPassword = await bcrypt.hash('Platform@123', 10);
    const platformUser = userRepo.create({
      tenant_id: null, 
      email: platformEmail,
      password_hash: platformPassword,
      role: UserRole.PLATFORM_ADMIN,
    });
    await userRepo.save(platformUser);
    console.log(`✅ Created PLATFORM_ADMIN: ${platformEmail} / Platform@123`);
  } else {
    console.log(`ℹ️ PLATFORM_ADMIN already exists: ${platformEmail}`);
  }

  let tenant = await tenantRepo.findOne({ where: { name: 'Demo Tenant' } });
  if (!tenant) {
    tenant = tenantRepo.create({ name: 'Demo Tenant' });
    await tenantRepo.save(tenant);
    console.log('✅ Tenant created:', tenant.id);
  } else {
    console.log('ℹ️ Tenant exists:', tenant.id);
  }

const users = [
  { email: 'platform@admin.com', role: UserRole.PLATFORM_ADMIN, tenant_id: null },
  { email: 'admin@demo.com', role: UserRole.TENANT_ADMIN, tenant_id: tenant.id },
  { email: 'manager@demo.com', role: UserRole.MANAGER, tenant_id: tenant.id },
  { email: 'agent@demo.com', role: UserRole.AGENT, tenant_id: tenant.id },
  { email: 'auditor@demo.com', role: UserRole.AUDITOR, tenant_id: tenant.id },
];


  const defaultPassword = 'ChangeMe123!';

for (const u of users) {
  const exists = await userRepo.findOne({ where: { email: u.email } });
  if (exists) {
    console.log(`⚠️  User exists, skipping: ${u.email}`);
    continue;
  }

  const password_hash = await bcrypt.hash(defaultPassword, 10);
  const newUser = userRepo.create({
    tenant_id: u.tenant_id,
    email: u.email,
    password_hash,
    role: u.role,
  });

  await userRepo.save(newUser);
  console.log(`✅ Created user: ${u.email} (${u.role})`);
}

 const existingSession = await sessionRepo.findOne({
    where: { tenant_id: tenant.id, external_session_id: 'default' },
  });
  if (!existingSession) {
    const session = sessionRepo.create({
      tenant_id: tenant.id,
      external_session_id: 'default',
      status: 'CONNECTED',
      metadata: { mock: true, info: 'seed-created default session' },
    });
    await sessionRepo.save(session);
    console.log('✅ Created WAHA session placeholder (default)');
  } else {
    console.log('ℹ️ WAHA session placeholder already exists');
  }

  console.log('🎉 Seeding complete.');
  await AppDataSource.destroy();
}

seed().catch(async (err) => {
  console.error('❌ Seeding failed:', err);
  try {
    await AppDataSource.destroy();
  } catch {
    
  }
  process.exit(1);
});
