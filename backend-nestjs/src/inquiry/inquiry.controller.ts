import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // 認証が必要な場合

@Controller('inquiries')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @Post()
  // @UseGuards(JwtAuthGuard) // ログイン必須にするならコメントアウトを外す
  create(@Body() createInquiryDto: CreateInquiryDto) {
    return this.inquiryService.create(createInquiryDto);
  }

  @Get()
  findAll() {
    return this.inquiryService.findAll();
  }
}
