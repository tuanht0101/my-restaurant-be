import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  async create(name: string) {
    const category = await this.prisma.category.create({
      data: {
        name: name,
      },
    });
    return category;
  }

  async getAll() {
    const categories = await this.prisma.category.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    return categories;
  }

  async updateOneById(id: number, name: string) {
    const cate = await this.findOneById(id);
    if (!cate) throw new NotFoundException('Category not found');

    await this.prisma.category.updateMany({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    const updatedCate = await this.findOneById(id);

    return updatedCate;
  }

  async findOneById(id: number) {
    if (!id) {
      return null;
    }

    const cate = await this.prisma.category.findUnique({
      where: {
        id: id,
      },
    });

    if (!cate) throw new NotFoundException('Category not found');

    return cate;
  }

  async findFilteredDatas(name: string): Promise<any[]> {
    try {
      const where: any = {
        name: {
          contains: name || undefined,
          mode: 'insensitive',
        },
      };

      const filteredDatas = await this.prisma.category.findMany({
        where,
        orderBy: {
          id: 'asc',
        },
      });

      return filteredDatas;
    } catch (error) {
      console.error('Error filtering tables:', error);
      throw error;
    }
  }

  async removeById(id: number) {
    if (!id) {
      return null;
    }

    const category = await this.findOneById(id);
    if (!category) throw new NotFoundException('Category not found');

    await this.prisma.category.delete({
      where: {
        id,
      },
    });
  }

  async deleteListById(idList: number[]) {
    try {
      await this.prisma.category.deleteMany({
        where: {
          id: {
            in: idList,
          },
        },
      });
    } catch (error) {
      console.error('Error deleting records:', error);
      console.log('123', idList);
      throw new Error('Error deleting records');
    }
  }
}
