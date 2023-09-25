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
      orderBy: { name: 'desc' },
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
}
