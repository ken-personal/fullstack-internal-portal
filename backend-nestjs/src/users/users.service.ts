import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AiService } from '../ai/ai.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private ai: AiService,
  ) {}

  private embedUser(u: { id: number; name: string; title: string; role: string; email: string }) {
    const text = `[社員] 名前: ${u.name} / 役職: ${u.title} / ロール: ${u.role} / メール: ${u.email}`;
    this.ai.upsertEmbedding('user', u.id, text).catch(() => {});
  }

  // 新規作成
  async create(dto: CreateUserDto) {
    const user = await this.prisma.user.create({ data: dto });
    this.embedUser(user);
    return user;
  }

  // サインアップ用
  async signUp(dto: any) {
    const user = await this.prisma.user.create({ data: dto });
    this.embedUser(user);
    return user;
  }

  // 全員取得
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        title: true,
        role: true,
        createdAt: true,
      },
    });
  }

  // 🔍 検索用メソッド
  async searchUsers(query: string) {
    return this.prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } }, // 名前で部分一致
          { title: { contains: query, mode: 'insensitive' } }, // 役職/部署で部分一致
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        title: true,
        role: true,
        createdAt: true,
      },
    });
  }

  // 1件取得
  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        title: true,
        role: true,
        createdAt: true,
      },
    });
  }

  // メールアドレスで検索（ログイン用）
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // 更新
  async update(id: number, dto: UpdateUserDto) {
    const data: any = { ...dto };
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }
    const user = await this.prisma.user.update({ where: { id }, data });
    this.embedUser(user);
    return user;
  }

  // 削除
  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
