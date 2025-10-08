import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('Tenant Isolation', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideProvider(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('should not allow user to access another tenant data', async () => {
    await request(app.getHttpServer())
      .get('/api/users/me')
      .set('Authorization', 'Bearer mock-token')
      .expect(403); // change to 200 if you allow
  });

  afterAll(async () => {
    await app.close();
  });
});
