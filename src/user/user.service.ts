import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { FilteredUserDto } from './dtos/filtered-user-dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: {
        id: 'asc',
      },
    });
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

  async findFilteredUsers(
    dto: FilteredUserDto,
    currentUserId: number,
  ): Promise<any[]> {
    try {
      const where: any = {
        email: {
          contains: dto.email || undefined,
          mode: 'insensitive',
        },
      };

      if (dto.fullname !== undefined) {
        where.fullname = {
          contains: dto.fullname || undefined,
          mode: 'insensitive',
        };
      }

      if (dto.phonenumber !== undefined) {
        where.phonenumber = {
          contains: dto.phonenumber || undefined,
        };
      }

      if (dto.role !== undefined) {
        where.role = dto.role;
      }

      const filteredUsers = await this.prisma.user.findMany({
        where,
        orderBy: {
          id: 'asc',
        },
      });

      const returnUsers = filteredUsers.filter(
        (user: any) => user.id !== currentUserId,
      );

      return returnUsers;
    } catch (error) {
      console.error('Error filtering tables:', error);
      throw error;
    }
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findOneById(id);

    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.updateMany({
      where: {
        id,
      },
      data: {
        fullname: dto.fullname,
        role: dto.role,
        phonenumber: dto.phonenumber,
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

  async deleteListById(idList: number[]) {
    try {
      await this.prisma.user.deleteMany({
        where: {
          id: {
            in: idList,
          },
        },
      });
    } catch (error) {
      console.error('Error deleting records:', error);
      throw new Error('Error deleting records');
    }
  }
}
