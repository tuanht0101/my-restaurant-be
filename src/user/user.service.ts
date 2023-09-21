import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findOneById(id: number) {
    if (!id) {
      return null;
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findOneById(id);

    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.updateMany({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });

    const updatedUser = await this.findOneById(id);

    return updatedUser;
  }

  async removeById(id: number) {
    if (!id) {
      return null;
    }

    const user = await this.findOneById(id);
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
