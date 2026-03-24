import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { S3Service } from './s3.service';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}

  async getUploadUrl(fileName: string, contentType: string, fileSize: number, uploadedBy: string) {
    const { uploadUrl, key } = await this.s3Service.generateUploadUrl(fileName, contentType);
    const document = await this.prisma.document.create({
      data: {
        fileName,
        fileKey: key,
        fileSize,
        mimeType: contentType,
        uploadedBy,
      },
    });
    return { uploadUrl, document };
  }

  async findAll() {
    return this.prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDownloadUrl(id: number) {
    const document = await this.prisma.document.findUnique({ where: { id } });
    if (!document) throw new Error('Document not found');
    const downloadUrl = await this.s3Service.generateDownloadUrl(document.fileKey);
    return { downloadUrl, document };
  }

  async remove(id: number) {
    const document = await this.prisma.document.findUnique({ where: { id } });
    if (!document) throw new Error('Document not found');
    await this.s3Service.deleteFile(document.fileKey);
    return this.prisma.document.delete({ where: { id } });
  }
}
