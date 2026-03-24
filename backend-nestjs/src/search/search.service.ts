import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(query: string) {
    const [users, announcements, inquiries] = await Promise.all([
      this.prisma.$queryRaw`
        SELECT id, name, email, role, "createdAt"
        FROM "User"
        WHERE name % ${query} OR name ILIKE ${'%' + query + '%'}
        ORDER BY similarity(name, ${query}) DESC
        LIMIT 5
      `,
      this.prisma.$queryRaw`
        SELECT id, title, content, author, date
        FROM "Announcement"
        WHERE title % ${query} OR content % ${query}
          OR title ILIKE ${'%' + query + '%'}
          OR content ILIKE ${'%' + query + '%'}
        ORDER BY similarity(title, ${query}) DESC
        LIMIT 5
      `,
      this.prisma.$queryRaw`
        SELECT id, title, message, "createdAt"
        FROM "Inquiry"
        WHERE title % ${query} OR message % ${query}
          OR title ILIKE ${'%' + query + '%'}
          OR message ILIKE ${'%' + query + '%'}
        ORDER BY similarity(title, ${query}) DESC
        LIMIT 5
      `,
    ]);

    return { users, announcements, inquiries };
  }
}
