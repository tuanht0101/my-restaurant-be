import { Injectable } from '@nestjs/common';
import { BillService } from 'src/bill/bill.service';
import { CategoryService } from 'src/category/category.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDetails() {
    const categoryCount = await this.prisma.category.count();
    const productCount = await this.prisma.product.count();
    const billCount = await this.prisma.bill.count();

    return {
      category: categoryCount,
      product: productCount,
      bill: billCount,
    };
  }
}
