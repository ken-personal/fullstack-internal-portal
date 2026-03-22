import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signUp(email: string, pass: string, name: string, title: string) {
    const hashedPassword = await bcrypt.hash(pass, 10);
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      name,
      title,
    });
    return user;
  }

  async login(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('ユーザーが見つかりません');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('パスワードが違います');
    }

    const payload = { sub: user.id, email: user.email };

    // ログイン通知メール送信
    try {
      await this.mailService.sendLoginNotification(user.email);
   } catch (err: any) {
  console.error('メール送信失敗:', JSON.stringify(err?.response?.body, null, 2));
          }
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        title: user.title,
        role: user.role,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('ユーザーが存在しません');
    }
    return user;
  }
}
