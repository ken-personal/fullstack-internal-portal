import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 新規作成
  async create(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: dto,
    });
  }

  // サインアップ用
  async signUp(dto: any) {
    return this.prisma.user.create({
      data: dto,
    });
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
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // 削除
  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
