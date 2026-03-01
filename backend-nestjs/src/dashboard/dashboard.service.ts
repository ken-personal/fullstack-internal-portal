import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service'; // ✅ パス修正

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const salesSum = await this.prisma.sale.aggregate({ _sum: { amount: true } });
    const expensesSum = await this.prisma.expense.aggregate({ _sum: { amount: true } });

    const totalSales = salesSum._sum.amount || 0;
    const totalExpenses = expensesSum._sum.amount || 0;

    return {
      totalSales,
      totalExpenses,
      netProfit: totalSales - totalExpenses
    };
  }
}
