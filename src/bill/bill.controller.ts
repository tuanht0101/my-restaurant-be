import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Delete,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CurrentUserId } from 'src/common/decorators/current-userId.decorator';
import { CreateBillDto } from './dtos/create-bill-dto';
import { BillService } from './bill.service';
import { GetPdfDto } from './dtos/get-pdf-dto';
import { Response } from 'express';
import { GetBillByStatus } from './dtos/get-bill-by-status.dto';
import { FilteredBillDto } from './dtos/filtered-bill.dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';

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

  @Get('status')
  getBillsByStatus(@Body() body: GetBillByStatus) {
    return this.billService.getBillsByStatus(body.status);
  }

  @Get(':id')
  getBillById(@Param('id') id: string) {
    return this.billService.getBillById(parseInt(id));
  }

  @Post('/filter')
  async findTables(@Body() body: FilteredBillDto): Promise<any[]> {
    return await this.billService.findFilteredBills(body);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  deleteById(@Param('id') id: string) {
    return this.billService.deleteById(parseInt(id));
  }

  @Post('deleteMany')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  deleteListById(@Body() body: { idList: number[] }) {
    return this.billService.deleteListById(body.idList);
  }

  @Patch(':id')
  updateStatus(@Param('id') id: string, @Body() body: GetBillByStatus) {
    return this.billService.updateBillStatus(parseInt(id), body.status);
  }
}
