import { BillStatus } from '@prisma/client';
import {
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBillDto {
  @IsString()
  @IsNotEmpty()
  guessName: string;

  @IsString()
  @IsNotEmpty()
  guessNumber: string;

  @IsNumber()
  total: number;

  @IsString()
  @IsJSON()
  productDetails: string;

  @IsString()
  @IsNotEmpty()
  tableName: string;

  @IsEnum(BillStatus)
  @IsOptional()
  status: BillStatus;
}
