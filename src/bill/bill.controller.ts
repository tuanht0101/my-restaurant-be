import { Controller, Post, Body } from '@nestjs/common';
import { CurrentUserId } from 'src/common/decorators/current-userId.decorator';
import { CreateBillDto } from './dtos/create-bill-dto';
import { BillService } from './bill.service';

@Controller('bill')
export class BillController {
  constructor(private billService: BillService) {}

  @Post('generateReport')
  generateReport(@CurrentUserId() userId: number, @Body() body: CreateBillDto) {
    return this.billService.createBill(userId, body);
  }
}
