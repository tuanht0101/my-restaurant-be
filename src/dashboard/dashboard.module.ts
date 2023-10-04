import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { CategoryService } from 'src/category/category.service';
import { ProductService } from 'src/product/product.service';
import { BillService } from 'src/bill/bill.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, BillService, UserService],
})
export class DashboardModule {}
