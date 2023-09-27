import { Module } from '@nestjs/common';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [BillController],
  providers: [BillService, UserService],
})
export class BillModule {}
