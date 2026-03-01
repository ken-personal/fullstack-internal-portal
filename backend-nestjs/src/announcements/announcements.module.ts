import { Module } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { AnnouncementsController } from './announcements.controller';
import { PrismaModule } from '../database/prisma.module'; // ✅ すべてここを "../database/..." に

@Module({
  imports: [PrismaModule], // ✅ これで Service 内で PrismaService が注入可能になります
  controllers: [AnnouncementsController],
  providers: [AnnouncementsService],
})
export class AnnouncementsModule {}
