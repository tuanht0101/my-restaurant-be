import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateStatusDto {
  @IsBoolean()
  @IsOptional()
  isAvailable: boolean;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
