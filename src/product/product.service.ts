import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product-dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryService } from 'src/category/category.service';
import { UpdateProductDto } from './dtos/update-product-dto';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private categoryService: CategoryService,
  ) {}
  async create(dto: CreateProductDto) {
    const isCategoryExisted = await this.categoryService.findOneById(
      dto.categoryId,
    );
    if (!isCategoryExisted)
      throw new NotFoundException('There is no category that you provided!');

    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        status: dto.status || 'true',
        categoryId: dto.categoryId,
      },
    });

    return product;
  }

  async getAll() {
    const products = await this.prisma.product.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });
    return products;
  }

  async getById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!product) throw new NotFoundException('Product not found ');

    return product;
  }

  async getByCategory(id: number) {
    const isCategoryExisted = await this.categoryService.findOneById(id);
    if (!isCategoryExisted)
      throw new NotFoundException('There is no category that you provided!');

    const products = await this.prisma.product.findMany({
      where: {
        categoryId: id,
        status: 'true',
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return products;
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.getById(id);
    if (!product) throw new NotFoundException('Product not found ');

    await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        status: dto.status,
        categoryId: dto.categoryId,
      },
    });

    const updatedProduct = await this.getById(id);
    return updatedProduct;
  }

  async updateStatus(id: number, status: string) {
    const product = await this.getById(id);
    if (!product) throw new NotFoundException('Product not found ');

    await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        status: status,
      },
    });

    const updatedProduct = await this.getById(id);
    return updatedProduct;
  }

  async delete(id: number) {
    if (!id) {
      return null;
    }

    const product = await this.getById(id);
    if (!product) throw new NotFoundException('Product not found ');

    await this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
