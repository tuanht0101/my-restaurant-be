import {
  IsString,
  MinLength,
  MaxLength,
  IsInt,
  Max,
  Min,
  IsNumber,
  IsEnum,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  // @MinLength(6)
  username: string;

  @IsString()
  // @MinLength(8)
  // @MaxLength(16)
  password: string;

  @IsEnum(Role)
  role: Role;

  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsEmail()
  email: string;

  @Min(18)
  @Max(100)
  age: number;
}
