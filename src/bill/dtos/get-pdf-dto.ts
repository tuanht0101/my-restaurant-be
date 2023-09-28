import { IsJSON, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetPdfDto {
  @IsString()
  @IsNotEmpty()
  uuid: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  contactNumber: string;

  @IsNumber()
  total: number;

  @IsString()
  @IsJSON()
  productDetails: string;
}
