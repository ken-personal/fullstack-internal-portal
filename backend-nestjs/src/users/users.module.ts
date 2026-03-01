import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../database/prisma.module'; // パスが正しいか確認！

@Module({
  imports: [PrismaModule], // UsersServiceがDBを触るために必要
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // これを出すことで、AuthModule側で使えるようになる
})
export class UsersModule {}
