import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

@Injectable()
export class InquiryService {
  constructor(private prisma: PrismaService) {}

  async create(createInquiryDto: CreateInquiryDto) {
    return this.prisma.inquiry.create({
      data: createInquiryDto,
    });
  }

  async findAll() {
    return this.prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
