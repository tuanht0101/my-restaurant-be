import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user-dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Tokens } from './types/tokens.type';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dtos/login-user-dto';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
const crypto = require('crypto');

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private JwtService: JwtService,
    private config: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async signup(dto: CreateUserDto) {
    const hashedPassword = await argon.hash(dto.password);

    const isExistedEmail = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (isExistedEmail) {
      throw new BadRequestException('User đã tồn tại');
    }

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
        fullname: dto.fullname,
        phonenumber: dto.phonenumber,
      },
    });

    // const tokens = await this.getTokens(newUser.id, newUser.email);
    // await this.updateRtHash(newUser.id, tokens.refresh_token);
    // return tokens;
    return newUser;
  }

  async signin(dto: LoginUserDto): Promise<Tokens> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not founds');
    }

    const passwordMatches = await argon.verify(user.password, dto.password);
    if (!passwordMatches) {
      throw new BadRequestException('Wrong credentials');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async whoAmI(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return user;
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

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    const [at, rt] = await Promise.all([
      this.JwtService.signAsync(
        {
          sub: userId,
          email,
          role: user.role,
        },
        {
          secret: this.config.get<string>('AT_SECRET'),
          expiresIn: 60 * 15,
        },
      ),
      this.JwtService.signAsync(
        {
          sub: userId,
          email,
          role: user.role,
        },
        {
          secret: this.config.get<string>('RT_SECRET'),
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

  async sendPassMail(email: string, phonenumber: string) {
    const randomString = this.generateRandomString(8);
    const hashedPassword = await argon.hash(randomString);

    const isExisted = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!isExisted) throw new NotFoundException('Email not found');

    if (isExisted.phonenumber !== phonenumber)
      throw new BadRequestException('Wrong phonenumber!', {
        cause: new Error(),
        description: 'Some error description',
      });

    const user = await this.prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: hashedPassword,
      },
    });
    await this.mailerService.sendMail({
      to: email,
      from: 'minhtuanphc203@gmail.com',
      subject: 'Reset password request from Midtaste Restaurant',
      html: `<b>Your new password is ${randomString} </b>`,
    });

    return isExisted;
  }

  async changePassword(id: number, oldPass: string, newPass: string) {
    const isExistedUser = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!isExistedUser) throw new NotFoundException('User not found');

    const passwordMatches = await argon.verify(isExistedUser.password, oldPass);
    const newPasswordMatches = await argon.verify(
      isExistedUser.password,
      newPass,
    );
    if (newPasswordMatches)
      throw new ForbiddenException(
        'New password is the same with the current password',
      );
    if (!passwordMatches)
      throw new ForbiddenException('The current password is wrong!!');

    const hashedPassword = await argon.hash(newPass);

    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return isExistedUser;
  }

  generateRandomString(length) {
    if (length % 2 !== 0) {
      throw new Error('Length must be an even number');
    }

    const bytes = crypto.randomBytes(length / 2);
    return bytes.toString('hex');
  }
}
