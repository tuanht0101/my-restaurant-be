import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user-dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Tokens } from './types/tokens.type';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private JwtService: JwtService) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
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
    const hashToken = await this.hashData(refreshToken);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refresh_token: hashToken,
      },
    });
  }

  async signup(dto: CreateUserDto): Promise<Tokens> {
    const hashedPassword = await this.hashData(dto.password);
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
  signin() {}
  logout() {}
  refreshTokens() {}
}
