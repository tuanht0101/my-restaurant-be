import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class FilteredUserDto {
  @IsOptional()
  email: string;

  @IsOptional()
  fullname: string;

  @IsOptional()
  phonenumber: string;

  @IsEnum(Role)
  @IsOptional()
  role: Role;
}
