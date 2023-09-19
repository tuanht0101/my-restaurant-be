import { IsEnum, IsOptional, IsString, Max, Min } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class UpdateUserDto {
  @IsEnum(Role)
  @IsOptional()
  role: Role;

  @IsString()
  @IsOptional()
  fullname: string;

  @Min(18)
  @Max(100)
  @IsOptional()
  age: number;
}
