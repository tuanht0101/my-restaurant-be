import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { CurrentUserId } from 'src/common/decorators/current-userId.decorator';
import { CreateBillDto } from './dtos/create-bill-dto';
import { BillService } from './bill.service';
import { GetPdfDto } from './dtos/get-pdf-dto';
import { Response } from 'express';
import { GetBillByStatus } from './dtos/get-bill-by-status.dto';

@Controller('bill')
export class BillController {
  constructor(private billService: BillService) {}

  @Post('generateReport')
  generateReport(@CurrentUserId() userId: number, @Body() body: CreateBillDto) {
    return this.billService.createBill(userId, body);
  }

  @Post('getPdf')
  async getPdf(
    @Res() res: Response,
    @CurrentUserId() userId: number,
    @Body() body: GetPdfDto,
  ) {
    await this.billService.getPdf(res, userId, body);
  }

  @Get()
  getBills() {
    return this.billService.getBills();
  }

  @Get()
  getBillsByStatus(@Body() body: GetBillByStatus) {
    return this.billService.getBillsByStatus(body.status);
  }

  @Get(':id')
  getBillById(@Param('id') id: string) {
    return this.billService.getBillById(parseInt(id));
  }

  @Delete(':id')
  deleteById(@Param('id') id: string) {
    return this.billService.deleteById(parseInt(id));
  }

  @Patch(':id')
  updateStatus(@Param('id') id: string, @Body() body: GetBillByStatus) {
    return this.billService.updateBillStatus(parseInt(id), body.status);
  }
}
