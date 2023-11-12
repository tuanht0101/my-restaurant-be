import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

    const isExistedProduct = await this.prisma.product.findFirst({
      where: {
        name: dto.name,
      },
    });

    if (isExistedProduct) throw new BadRequestException('Product existed!');

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

  async findFilteredDatas(name: string): Promise<any[]> {
    try {
      const where: any = {
        name: {
          contains: name || undefined,
          mode: 'insensitive',
        },
      };

      const filteredDatas = await this.prisma.product.findMany({
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
