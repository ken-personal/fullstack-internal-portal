import { Controller, Get } from '@nestjs/common'; // ✅ 追加
import { DashboardService } from './dashboard.service'; // ✅ 追加

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  getSummary() {
    return this.dashboardService.getSummary();
  }
}
