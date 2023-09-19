import { IsString, MinLength, MaxLength } from 'class-validator';

export class LoginUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
