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
    const billCount = await this.prisma.bill.count({
      where: {
        status: 'DONE',
      },
    });
    const tableCount = await this.prisma.table.count();

    return {
      category: categoryCount,
      product: productCount,
      bill: billCount,
      table: tableCount,
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

  async getTotalBillsByMonth(year: number): Promise<number[]> {
    const totals: number[] = [];

    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0); // Adjust month to zero-based index
      const endDate =
        month === 12
          ? new Date(year + 1, 0, 1, 0, 0, 0, 0) // Start of next year
          : new Date(year, month, 1, 0, 0, 0, 0);

      const totalForMonth = await this.prisma.bill.aggregate({
        _sum: {
          total: true,
        },
        where: {
          status: 'DONE',
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      });

      totals.push(totalForMonth._sum?.total || 0);
    }

    return totals;
  }
  async getTotalBillsForCurrentAndLastYear(): Promise<{
    thisYear: number[];
    lastYear: number[];
  }> {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;

    const thisYearTotals = await this.getTotalBillsByMonth(currentYear);
    const lastYearTotals = await this.getTotalBillsByMonth(lastYear);
    return {
      thisYear: thisYearTotals,
      lastYear: lastYearTotals,
    };
  }

  async getBillCurrentMonth(): Promise<number> {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Adjust month to one-based index

    const startDate = new Date(currentYear, currentMonth - 1, 1, 0, 0, 0, 0); // Adjust month to zero-based index
    const endDate =
      currentMonth === 12
        ? new Date(currentYear + 1, 0, 1, 0, 0, 0, 0) // Start of next year
        : new Date(currentYear, currentMonth, 1, 0, 0, 0, 0);

    const totalForCurrentMonth = await this.prisma.bill.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: 'DONE',
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    return totalForCurrentMonth._sum?.total || 0;
  }
}
