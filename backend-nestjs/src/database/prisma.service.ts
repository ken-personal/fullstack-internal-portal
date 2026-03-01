import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          // Docker環境変数 (postgres:5432) を確実に読み込む
          url: config.get<string>('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Successfully connected to Database');
    } catch (error) {
      console.error('Failed to connect to Database:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
