import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service'; // ✅ すべてここを "../database/..." に
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateAnnouncementDto) {
    return this.prisma.announcement.create({ data: dto });
  }

  findAll() {
    return this.prisma.announcement.findMany({
      orderBy: { date: 'desc' }, // 新しい順
    });
  }

  update(id: number, dto: UpdateAnnouncementDto) {
    return this.prisma.announcement.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: number) {
    return this.prisma.announcement.delete({ where: { id } });
  }
}
