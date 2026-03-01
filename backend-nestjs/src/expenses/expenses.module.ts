import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { PrismaModule } from '../database/prisma.module'; // ✅ すべてここを "../database/..." に	

@Module({
  imports: [PrismaModule], // ✅ これがないと Service で Prisma が使えません
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class ExpensesModule {}
