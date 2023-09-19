import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user-dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Tokens } from './types/tokens.type';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dtos/login-user-dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private JwtService: JwtService) {}

  async signup(dto: CreateUserDto): Promise<Tokens> {
    const hashedPassword = await argon.hash(dto.password);

    const isExisted = await this.prisma.user.findFirst({
      where: {
        username: dto.username,
      },
    });

    if (isExisted) {
      throw new BadRequestException('User đã tồn tại');
    }

    const newUser = await this.prisma.user.create({
      data: {
        username: dto.username,
        password: hashedPassword,
        role: dto.role,
        fullname: dto.fullname,
        email: dto.email,
        age: dto.age,
      },
    });

    const tokens = await this.getTokens(newUser.id, newUser.username);
    await this.updateRtHash(newUser.id, tokens.refresh_token);
    return tokens;
  }

  async signin(dto: LoginUserDto): Promise<Tokens> {
    const user = await this.prisma.user.findFirst({
      where: {
        username: dto.username,
      },
    });

    if (!user) {
      throw new NotFoundException('User not founds');
    }

    const passwordMatches = await argon.verify(user.password, dto.password);
    if (!passwordMatches) {
      throw new BadRequestException('Wrong credentials');
    }

    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        refresh_token: {
          not: null,
        },
      },
      data: {
        refresh_token: null,
      },
    });
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.refresh_token) {
      throw new ForbiddenException('Access denied');
    }

    const rtMatch = await argon.verify(user.refresh_token, refreshToken);
    if (!rtMatch) throw new ForbiddenException('Access denied');

    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async getTokens(userId: number, username: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.JwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: 'at-secret',
          expiresIn: 60 * 15,
        },
      ),
      this.JwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: 'rt-secret',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRtHash(userId: number, refreshToken: string) {
    const hashToken = await argon.hash(refreshToken);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refresh_token: hashToken,
      },
    });
  }
}
