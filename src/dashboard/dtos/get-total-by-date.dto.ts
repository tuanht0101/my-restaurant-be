import { IsNumber, Max, Min } from 'class-validator';

export class GetTotalByDateDto {
  @IsNumber()
  @Min(1)
  @Max(12)
  startMonth: number;

  @IsNumber()
  startYear: number;

  @IsNumber()
  @Min(1)
  @Max(12)
  endMonth: number;

  @IsNumber()
  endYear: number;
}
