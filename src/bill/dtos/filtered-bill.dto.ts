import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BillStatus } from 'src/common/enums/billStatus.enum';

export class FilteredBillDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  guessName: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  guessNumber: string;

  @IsEnum(BillStatus)
  @IsOptional()
  status: BillStatus;

  @IsOptional()
  startDate: Date;

  @IsOptional()
  endDate: Date;
}
