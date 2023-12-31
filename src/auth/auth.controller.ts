import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Req,
  Patch,
  Get,
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
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserDto } from 'src/user/dtos/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  @Serialize(UserDto)
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() body: LoginUserDto): Promise<Tokens> {
    return this.authService.signin(body);
  }

  @Get('whoami')
  whoami(@CurrentUserId() userId: number) {
    return this.authService.whoAmI(userId);
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

  @Public()
  @Post('reset-password')
  @Serialize(UserDto)
  sendMail(@Body() body: { email: string; phonenumber: string }) {
    return this.authService.sendPassMail(body.email, body.phonenumber);
  }

  @Patch('change-password')
  @Serialize(UserDto)
  changePassword(
    @CurrentUserId() userId: number,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    return this.authService.changePassword(
      userId,
      body.oldPassword,
      body.newPassword,
    );
  }
}
