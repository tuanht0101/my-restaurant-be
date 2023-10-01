import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateTableDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(1)
  @Max(32)
  capacity: number;

  @IsBoolean()
  isPrivate: boolean;

  @IsBoolean()
  @IsOptional()
  isAvailable: boolean;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
