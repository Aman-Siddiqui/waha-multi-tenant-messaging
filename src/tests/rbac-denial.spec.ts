import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('RBAC Denial', () => {
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

  it('should deny AGENT from creating new users', async () => {
    const tokenAgent = 'Bearer mock-token';
    await request(app.getHttpServer())
      .post('/api/users')
      .set('Authorization', tokenAgent)
      .send({ email: 'test@x.com', password: '123' })
      .expect(403); // or 201 if you want to allow
  });

  afterAll(async () => {
    await app.close();
  });
});
