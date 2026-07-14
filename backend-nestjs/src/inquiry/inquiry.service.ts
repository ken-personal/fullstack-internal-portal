import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AiService } from '../ai/ai.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

@Injectable()
export class InquiryService {
  constructor(
    private prisma: PrismaService,
    private ai: AiService,
  ) {}

  async create(createInquiryDto: CreateInquiryDto) {
    const inquiry = await this.prisma.inquiry.create({ data: createInquiryDto });
    const text = `[問い合わせ] タイトル: ${inquiry.title}\n内容: ${inquiry.message}`;
    this.ai.upsertEmbedding('inquiry', inquiry.id, text).catch(() => {});
    return inquiry;
  }

  async findAll() {
    return this.prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
