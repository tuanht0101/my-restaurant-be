import { BadRequestException, Injectable } from '@nestjs/common';
import { BillService } from 'src/bill/bill.service';
import { CategoryService } from 'src/category/category.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from 'src/product/product.service';
import { GetTotalByDateDto } from './dtos/get-total-by-date.dto';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private billService: BillService,
  ) {}

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

  async getTotalByDate(dto: GetTotalByDateDto) {
    if (
      dto.startYear > dto.endYear ||
      (dto.startYear === dto.endYear && dto.startMonth > dto.endMonth)
    ) {
      throw new BadRequestException(
        'Invalid date range. Make sure the start date is before the end date.',
      );
    }
    const startDate = new Date(
      dto.startYear,
      dto.startMonth - 1,
      1,
      0,
      0,
      0,
      0,
    ); // Adjust month to zero-based index
    const endDate = new Date(dto.endYear, dto.endMonth - 1, 1, 0, 0, 0, 0); // Adjust month to zero-based index

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestException(
        'Invalid date format. Please provide valid date parameters.',
      );
    }

    const bills = await this.prisma.bill.findMany({
      where: {
        status: 'DONE',
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    const totals = bills.reduce(
      (accumulator, currentBill) => accumulator + currentBill.total,
      0,
    );

    return totals;
  }
}
