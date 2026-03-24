import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UsersModule } from './users/users.module'
import { ExpensesModule } from './expenses/expenses.module'
import { SalesModule } from './sales/sales.module'
import { AnnouncementsModule } from './announcements/announcements.module'
import { InquiryModule } from './inquiry/inquiry.module'
import { DashboardModule } from './dashboard/dashboard.module'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './database/prisma.module'
import { DocumentsModule } from './documents/documents.module'
import { SearchModule } from './search/search.module'
import { StripeModule } from './stripe/stripe.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    ExpensesModule,
    SalesModule,
    AnnouncementsModule,
    InquiryModule,
    DashboardModule,
    AuthModule,
    DocumentsModule,
    SearchModule,
    StripeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
