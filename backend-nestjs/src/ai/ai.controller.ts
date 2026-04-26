import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { ChatDto } from './dto/chat.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /**
   * POST /ai/chat
   * 社内データを参照した RAG チャット
   */
  @Post('chat')
  @HttpCode(HttpStatus.OK)
  async chat(@Body() dto: ChatDto): Promise<{ answer: string; sources: string[] }> {
    return this.aiService.chat(dto.message);
  }

  /**
   * POST /ai/index
   * 社内データを全件ベクトル化してインデックスに保存（ADMIN のみ）
   */
  @Post('index')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async index(): Promise<{ indexed: number }> {
    return this.aiService.indexAllData();
  }
}
