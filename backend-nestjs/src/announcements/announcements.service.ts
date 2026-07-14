import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AiService } from '../ai/ai.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    private prisma: PrismaService,
    private ai: AiService,
  ) {}

  async create(dto: CreateAnnouncementDto) {
    const announcement = await this.prisma.announcement.create({ data: dto });
    const text = `[お知らせ] タイトル: ${announcement.title}\n内容: ${announcement.content}\n投稿者: ${announcement.author}`;
    this.ai.upsertEmbedding('announcement', announcement.id, text).catch(() => {});
    return announcement;
  }

  findAll() {
    return this.prisma.announcement.findMany({ orderBy: { date: 'desc' } });
  }

  async update(id: number, dto: UpdateAnnouncementDto) {
    const announcement = await this.prisma.announcement.update({ where: { id }, data: dto });
    const text = `[お知らせ] タイトル: ${announcement.title}\n内容: ${announcement.content}\n投稿者: ${announcement.author}`;
    this.ai.upsertEmbedding('announcement', announcement.id, text).catch(() => {});
    return announcement;
  }

  async remove(id: number) {
    const announcement = await this.prisma.announcement.delete({ where: { id } });
    this.ai.deleteEmbedding('announcement', id).catch(() => {});
    return announcement;
  }
}
