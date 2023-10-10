import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateBillDto } from './dtos/create-bill-dto';
import { error } from 'console';
import { GetPdfDto } from './dtos/get-pdf-dto';
import { Response } from 'express';
import { format } from 'date-fns';
import { GetBillByStatus } from './dtos/get-bill-by-status.dto';
import { BillStatus } from 'src/common/enums/billStatus.enum';
let ejs = require('ejs');
let pdf = require('html-pdf');
var uuid = require('uuid');
let path = require('path');
var fs = require('fs');

@Injectable()
export class BillService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async createBill(userId: number, dto: CreateBillDto) {
    const user = await this.userService.findOneById(userId);
    if (!user) throw new NotFoundException('User not found');

    const generatedUuid = uuid.v1();

    try {
      const productDetails = JSON.parse(dto.productDetails);
      const bill = await this.prisma.bill.create({
        data: {
          uuid: generatedUuid,
          guessName: dto.guessName,
          guessNumber: dto.guessNumber,
          total: dto.total,
          productDetails: dto.productDetails,
          tableName: dto.tableName,
          createdBy: user.email,
        },
      });

      // Render the EJS template
      const templatePath = await path.join(
        __dirname,
        '../../views/',
        'report.ejs',
      );
      const renderedHtml = await ejs.renderFile(templatePath, {
        productDetails: productDetails,
        guessName: dto.guessName,
        status: dto.status,
        guessNumber: dto.guessNumber,
        tableName: dto.tableName,
        totalAmount: dto.total,
        date: format(bill.createdAt, 'HH:mm:ss MMMM dd, yyyy'),
      });

      // Generate the PDF
      const pdfPath = `./generated_pdf/${generatedUuid}.pdf`;
      await new Promise<void>((resolve, reject) => {
        pdf.create(renderedHtml).toFile(pdfPath, (err, data) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve();
          }
        });
      });

      return { uuid: generatedUuid };
    } catch (error) {
      // Handle errors here, e.g., log them or throw a custom exception
      console.error(error);
      throw new Error('Failed to create bill');
    }
  }

  async getBills() {
    const bills = await this.prisma.bill.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    return bills;
  }

  async getBillsByStatus(status: BillStatus) {
    const bills = await this.prisma.bill.findMany({
      orderBy: {
        id: 'desc',
      },
      where: {
        status,
      },
    });

    return bills;
  }

  async updateBillStatus(id: number, status: BillStatus) {
    const bill = await this.getBillById(id);
    const updatedBill = await this.prisma.bill.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    return updatedBill;
  }

  async getPdf(res: Response, userId: number, body: GetPdfDto) {
    const timestamp = Date.now();
    const formattedDate = format(timestamp, 'HH:mm:ss MMMM dd, yyyy');
    const pdfPath = `./generated_pdf/${body.uuid}.pdf`;

    const productDetails = JSON.parse(body.productDetails);

    const templatePath = await path.join(
      __dirname,
      '../../views/',
      'report.ejs',
    );
    const renderedHtml = await ejs.renderFile(templatePath, {
      productDetails: productDetails,
      guessName: body.guessName,
      guessNumber: body.guessNumber,
      totalAmount: body.total,
      tableName: body.tableName,
      status: body.status || 'PENDING',
      date: formattedDate,
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

  async getBillById(id: number) {
    if (!id) return null;
    const isExistedBill = await this.prisma.bill.findUnique({
      where: {
        id,
      },
    });

    if (!isExistedBill) throw new NotFoundException('Bill not found');
    return isExistedBill;
  }

  async deleteById(id: number) {
    const isExistedBill = await this.prisma.bill.findUnique({
      where: {
        id,
      },
    });

    if (!isExistedBill) throw new NotFoundException('Bill not found');
    await this.prisma.bill.delete({
      where: {
        id,
      },
    });
  }
}
