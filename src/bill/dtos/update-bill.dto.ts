import { BillStatus } from '@prisma/client';
import {
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateBillDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  guessName: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  guessNumber: string;

  @IsNumber()
  @IsOptional()
  total: number;

  @IsString()
  @IsJSON()
  @IsOptional()
  productDetails: any;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  tableName: string;

  @IsEnum(BillStatus)
  @IsOptional()
  status: BillStatus;
}
