import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        ...dto,
        date: new Date(dto.date),
      },
    });
  }

  findAll() {
    return this.prisma.expense.findMany({
      orderBy: { date: 'desc' },
    });
  }

  update(id: number, dto: UpdateExpenseDto) {
    const data: any = { ...dto };
    if (dto.date) data.date = new Date(dto.date);

    return this.prisma.expense.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.expense.delete({
      where: { id },
    });
  }
} // ✅ このカッコが重要です！
