import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { CurrentUserId } from 'src/common/decorators/current-userId.decorator';
import { CreateBillDto } from './dtos/create-bill-dto';
import { BillService } from './bill.service';
import { GetPdfDto } from './dtos/get-pdf-dto';
import { Response } from 'express';
let ejs = require('ejs');
let pdf = require('html-pdf');
var uuid = require('uuid');
let path = require('path');
var fs = require('fs');

@Controller('bill')
export class BillController {
  constructor(private billService: BillService) {}

  @Post('generateReport')
  generateReport(@CurrentUserId() userId: number, @Body() body: CreateBillDto) {
    return this.billService.createBill(userId, body);
  }

  @Post('getPdf')
  async getPdf(@Res() res: Response, @Body() body: GetPdfDto) {
    const pdfPath = `./generated_pdf/${body.uuid}.pdf`;

    const productDetails = JSON.parse(body.productDetails);

    const templatePath = await path.join(
      __dirname,
      '../../views/',
      'report.ejs',
    );
    const renderedHtml = await ejs.renderFile(templatePath, {
      productDetails: productDetails,
      name: body.name,
      contactNumber: body.contactNumber,
      totalAmount: body.total,
    });

    if (fs.existsSync(pdfPath)) {
      res.contentType('application/pdf');
      const fileStream = fs.createReadStream(pdfPath);
      fileStream.pipe(res);
    } else {
      await new Promise<void>((resolve, reject) => {
        pdf.create(renderedHtml).toFile(pdfPath, (err, data) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve();

            res.contentType('application/pdf');
            const fileStream = fs.createReadStream(pdfPath);
            fileStream.pipe(res);
          }
        });
      });
    }
  }

  @Get()
  getBills() {
    return this.billService.getBills();
  }

  @Delete(':id')
  deleteById(@Param('id') id: string) {
    return this.billService.deleteById(parseInt(id));
  }
}
