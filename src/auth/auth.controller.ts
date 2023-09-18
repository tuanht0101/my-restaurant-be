import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user-dto';
import { Tokens } from './types/tokens.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: CreateUserDto): Promise<Tokens> {
    return this.authService.signup(body);
  }

  @Post('signin')
  signin() {
    this.authService.signin();
  }

  @Post('logout')
  logout() {
    this.authService.logout();
  }

  @Post('refresh')
  refreshTokens() {
    this.authService.refreshTokens();
  }
}
