import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload-url')
  async getUploadUrl(
    @Body() body: { fileName: string; contentType: string; fileSize: number; uploadedBy: string },
  ) {
    return this.documentsService.getUploadUrl(
      body.fileName,
      body.contentType,
      body.fileSize,
      body.uploadedBy,
    );
  }

  @Get()
  async findAll() {
    return this.documentsService.findAll();
  }

  @Get(':id/download-url')
  async getDownloadUrl(@Param('id') id: string) {
    return this.documentsService.getDownloadUrl(Number(id));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.documentsService.remove(Number(id));
  }
}
