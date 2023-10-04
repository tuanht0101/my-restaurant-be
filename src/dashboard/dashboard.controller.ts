import { Body, Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { GetTotalByDateDto } from './dtos/get-total-by-date.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('details')
  getDetails() {
    return this.dashboardService.getDetails();
  }

  @Get('totals')
  getTotals(@Body() body: GetTotalByDateDto) {
    return this.dashboardService.getTotalByDate(body);
  }
}
