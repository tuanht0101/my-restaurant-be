import { IsEnum, IsNotEmpty } from 'class-validator';
import { BillStatus } from 'src/common/enums/billStatus.enum';

export class GetBillByStatus {
  @IsNotEmpty()
  @IsEnum(BillStatus)
  status: BillStatus;
}
