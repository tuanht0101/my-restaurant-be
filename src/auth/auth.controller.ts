import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user-dto';
import { Tokens } from './types/tokens.type';
import { LoginUserDto } from './dtos/login-user-dto';
import { AuthGuard } from '@nestjs/passport';
import { AtGuard } from 'src/common/guards/at.guard';
import { RtGuard } from 'src/common/guards/rt.guard';
import { CurrentUserId } from 'src/common/decorators/current-userId.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() body: CreateUserDto): Promise<Tokens> {
    return this.authService.signup(body);
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() body: LoginUserDto): Promise<Tokens> {
    return this.authService.signin(body);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@CurrentUserId() userId: number) {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  refreshTokens(
    @CurrentUserId() userId: number,
    @CurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
