import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service'; // ✅ パス修正
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateSaleDto) {
    return this.prisma.sale.create({
      data: {
        ...dto,
        date: new Date(dto.date),
      },
    });
  }

  findAll() {
    return this.prisma.sale.findMany({
      orderBy: { date: 'desc' },
    });
  }

  update(id: number, dto: UpdateSaleDto) {
    const data: any = { ...dto };
    if (dto.date) data.date = new Date(dto.date);

    return this.prisma.sale.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.sale.delete({
      where: { id },
    });
  }
}
