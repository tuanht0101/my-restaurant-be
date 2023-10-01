import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTableDto } from './dtos/create-table-dto';
import { UpdateTableDto } from './dtos/update-table-dto';
import { UpdateStatusDto } from './dtos/update-status-dto';

@Injectable()
export class TableService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTableDto) {
    const table = await this.prisma.table.create({
      data: {
        name: dto.name,
        capacity: dto.capacity,
        isPrivate: dto.isPrivate,
        isAvailable: dto.isAvailable,
        isActive: dto.isActive,
      },
    });

    return table;
  }

  async getAll() {
    const tables = await this.prisma.table.findMany();

    return tables;
  }

  async getById(id: number) {
    if (!id) return null;

    const table = await this.prisma.table.findUnique({
      where: {
        id,
      },
    });

    if (!table) throw new NotFoundException('Table not found');
    return table;
  }

  async updateById(id: number, dto: UpdateTableDto) {
    const table = await this.getById(id);
    if (!table) throw new NotFoundException('Table not found ');

    await this.prisma.table.update({
      where: {
        id,
      },
      data: {
        name: dto.name,
        capacity: dto.capacity,
        isPrivate: dto.isPrivate,
        isAvailable: dto.isAvailable,
        isActive: dto.isActive,
      },
    });

    const updatedTable = await this.getById(id);
    return updatedTable;
  }

  async updateStatus(id: number, dto: UpdateStatusDto) {
    const table = await this.getById(id);
    if (!table) throw new NotFoundException('Table not found ');

    await this.prisma.table.update({
      where: {
        id,
      },
      data: {
        isAvailable: dto.isAvailable,
        isActive: dto.isActive,
      },
    });

    const updatedTable = await this.getById(id);
    return updatedTable;
  }

  async deleteById(id: number) {
    const table = await this.getById(id);
    if (!table) throw new NotFoundException('Table not found ');

    await this.prisma.table.delete({
      where: {
        id,
      },
    });
  }
}
