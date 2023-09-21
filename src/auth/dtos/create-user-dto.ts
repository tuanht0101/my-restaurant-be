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
  IsDateString,
  IsDate,
} from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  // @MinLength(8)
  // @MaxLength(16)
  password: string;

  @IsEnum(Role)
  role: Role;

  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsString()
  @IsNotEmpty()
  phonenumber: string;

  @IsDateString()
  birthday: Date;
}
