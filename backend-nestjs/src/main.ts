import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  // Stripe Webhook は署名検証のため rawBody が必要
  app.use(
    '/stripe/webhook',
    express.raw({ type: 'application/json' }),
  );

  // ✅ これがないとフロントエンドから通信を拒否されます
  app.enableCors();

  // ✅ Docker内部のポート（3000）でリッスン
  await app.listen(3000);

  console.log('--- Startup Check ---');
  console.log('🚀 NestJS backend is running on port 3000 (Mapped to 3001 outside)');
  console.log('----------------------');
}
bootstrap();
