import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';

import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

    
    const config = new DocumentBuilder()
    .setTitle('AI WAHA API')
    .setDescription('Multi-tenant WhatsApp Integration API')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();


    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

  
  app.use(json({ limit: '5mb' }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));


  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT || 3000);
  console.log(`🚀 Server running on http://localhost:${process.env.PORT || 3000}`);
  console.log(`📘 Swagger Docs: http://localhost:${process.env.PORT || 3000}/api/docs`);
}
bootstrap();
