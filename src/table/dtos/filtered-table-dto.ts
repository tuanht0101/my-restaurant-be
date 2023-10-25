import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FilteredTableDto {
  @IsOptional()
  search: string;

  @IsOptional()
  isPrivate: string;

  @IsOptional()
  isAvailable: string;

  @IsOptional()
  isActive: string;

  @Transform(({ value }) => value === 'true')
  get isPrivateBool(): boolean {
    return this.isPrivate === 'true';
  }

  @Transform(({ value }) => value === 'true')
  get isAvailableBool(): boolean {
    return this.isAvailable === 'true';
  }

  @Transform(({ value }) => value === 'true')
  get isActiveBool(): boolean {
    return this.isActive === 'true';
  }
}
