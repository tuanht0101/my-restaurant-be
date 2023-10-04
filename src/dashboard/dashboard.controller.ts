import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { GetTotalByDateDto } from './dtos/get-total-by-date.dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('details')
  getDetails() {
    return this.dashboardService.getDetails();
  }

  @Get('totals')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  getTotals(@Body() body: GetTotalByDateDto) {
    return this.dashboardService.getTotalByDate(body);
  }
}
