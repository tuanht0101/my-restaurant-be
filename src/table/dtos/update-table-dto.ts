import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateTableDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsNumber()
  @Min(1)
  @Max(32)
  @IsOptional()
  capacity: number;

  @IsBoolean()
  @IsOptional()
  isPrivate: boolean;

  @IsBoolean()
  @IsOptional()
  isAvailable: boolean;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
