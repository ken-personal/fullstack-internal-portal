import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UsersModule } from './users/users.module'
import { ExpensesModule } from './expenses/expenses.module'
import { SalesModule } from './sales/sales.module'
import { AnnouncementsModule } from './announcements/announcements.module'
import { InquiryModule } from './inquiry/inquiry.module'
import { DashboardModule } from './dashboard/dashboard.module'
import { AuthModule } from './auth/auth.module'
// --- ここを修正：common ではなく database から Module をインポート ---
import { PrismaModule } from './database/prisma.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule, // --- ここに追加：これで全モジュールで Prisma が使えるようになる ---
    UsersModule,
    ExpensesModule,
    SalesModule,
    AnnouncementsModule,
    InquiryModule,
    DashboardModule,
    AuthModule,
  ],
  controllers: [],
  providers: [], // --- ここから PrismaService を削除（PrismaModule が管理するため） ---
})
export class AppModule {}
