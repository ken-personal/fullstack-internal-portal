import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ これがないとフロントエンドから通信を拒否されます
  app.enableCors();

  // ✅ Docker内部のポート（3000）でリッスン
  await app.listen(3000);

  console.log('--- Startup Check ---');
  console.log('🚀 NestJS backend is running on port 3000 (Mapped to 3001 outside)');
  console.log('----------------------');
}
bootstrap();
