import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateBillDto } from './dtos/create-bill-dto';
import { error } from 'console';
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
          name: dto.name,
          contactNumber: dto.contactNumber,
          total: dto.total,
          productDetails: dto.productDetails,
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
        name: dto.name,
        contactNumber: dto.contactNumber,
        totalAmount: dto.total,
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
}
