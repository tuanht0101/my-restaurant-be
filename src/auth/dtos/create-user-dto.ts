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
  IsOptional,
  IsPhoneNumber,
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
  @IsOptional()
  role: Role;

  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsString()
  @IsNotEmpty()
  phonenumber: string;
}
