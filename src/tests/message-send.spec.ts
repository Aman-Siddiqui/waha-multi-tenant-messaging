import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('Message Send', () => {
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

  it('should send message using WAHA mock', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/messages/send')
      .set('Authorization', 'Bearer mock-token')
      .send({ phone: '919999999999', text: 'Hello World' })
      .expect(201);

    expect(res.body).toHaveProperty('phone_number');
    expect(res.body.text).toBe('Hello World');
  });

  afterAll(async () => {
    await app.close();
  });
});
