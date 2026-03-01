import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { PrismaModule } from '../database/prisma.module'; // ✅ パスは database に統一

@Module({
  imports: [PrismaModule],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
