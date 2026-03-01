import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PrismaModule } from '../database/prisma.module'; // ✅ すべてここを "../database/..." に

@Module({
  imports: [PrismaModule], // ✅ これで Service 内で PrismaService を使えます
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
