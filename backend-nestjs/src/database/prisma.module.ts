import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config'; // 追加

@Global()
@Module({
  imports: [ConfigModule], // 追加：これで PrismaService が環境変数を使えるようになる
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
