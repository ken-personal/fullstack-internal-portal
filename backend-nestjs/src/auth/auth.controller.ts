import { Body, Controller, Post, HttpCode, HttpStatus, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signUp(@Body() signUpDto: any) {
    return this.authService.signUp(
      signUpDto.email,
      signUpDto.password,
      signUpDto.name,
      signUpDto.title,
    );
  }

  @Post('login')
  async login(@Body() loginDto: any) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    // ✅ JwtStrategy の validate で返しているプロパティ名 (userId) を使います
    // console.log('AuthUser:', req.user); // デバッグ用
    return this.authService.getProfile(req.user.userId);
  }
}
