import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

describe('Auth Login (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply the same global settings as in main.ts
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
  });

  it('/api/auth/login (POST) → should login successfully', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'admin@demo.com',     // Make sure this user exists in DB!
        password: 'ChangeMe123!',    // And the password is correct
      })
      .expect(200);

    expect(res.body).toHaveProperty('access_token');
  });

  afterAll(async () => {
    await app.close();
  });
});
