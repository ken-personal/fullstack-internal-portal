import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * 新規ユーザー登録
   */
  async signUp(email: string, pass: string, name: string, title: string) {
    // 1. パスワードを暗号化（ハッシュ化）する
    const hashedPassword = await bcrypt.hash(pass, 10);

    // 2. データベースに保存
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      name,
      title,
    });

    return user;
  }

  /**
   * ログイン処理
   */
  async login(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('ユーザーが見つかりません');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('パスワードが違います');
    }

    // JWTペイロードの作成（subはユーザーID）
    const payload = { sub: user.id, email: user.email };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        title: user.title,
        role: user.role, // roleを追加
      },
    };
  }
// backend-nestjs/src/auth/auth.service.ts

async getProfile(userId: number) {
  // 修正：usersService.findOneById ではなく findOne を呼ぶ
  const user = await this.usersService.findOne(userId);
  
  if (!user) {
    throw new UnauthorizedException('ユーザーが存在しません');
  }

  // UsersService.findOne はすでにパスワードを除外しているので、そのまま返せます
  return user;
 }
}
