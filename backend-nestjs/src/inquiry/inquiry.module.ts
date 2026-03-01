import { Module } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { InquiryController } from './inquiry.controller';
import { PrismaModule } from '../database/prisma.module'; // 🔴 ここを ../database/ に修正

@Module({
  imports: [PrismaModule],
  controllers: [InquiryController],
  providers: [InquiryService],
})
export class InquiryModule {}
