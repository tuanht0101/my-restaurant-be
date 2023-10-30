import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTableDto } from './dtos/create-table-dto';
import { UpdateTableDto } from './dtos/update-table-dto';
import { UpdateStatusDto } from './dtos/update-status-dto';
import { FilteredTableDto } from './dtos/filtered-table-dto';

@Injectable()
export class TableService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTableDto) {
    try {
      dto.capacity = parseInt(dto.capacity as any, 10);
      const table = await this.prisma.table.create({
        data: {
          name: dto.name,
          capacity: dto.capacity,
          isPrivate: dto.isPrivate,
          isAvailable: dto.isAvailable,
          isActive: dto.isActive,
        },
      });
      console.log(dto);
      return table;
    } catch (error) {
      console.log(error);
      console.log(dto);
    }
  }

  async getAll() {
    const tables = await this.prisma.table.findMany({
      orderBy: {
        name: 'asc',
      },
    });

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

  async findTables(dto: FilteredTableDto): Promise<any[]> {
    try {
      const where: any = {
        name: {
          contains: dto.search || undefined,
          mode: 'insensitive',
        },
      };

      if (dto.isPrivate !== undefined) {
        where.isPrivate =
          dto.isPrivate === 'true'
            ? true
            : dto.isPrivate === 'false'
            ? false
            : undefined;
      }

      if (dto.isAvailable !== undefined) {
        where.isAvailable =
          dto.isAvailable === 'true'
            ? true
            : dto.isAvailable === 'false'
            ? false
            : undefined;
      }

      if (dto.isActive !== undefined) {
        where.isActive =
          dto.isActive === 'true'
            ? true
            : dto.isActive === 'false'
            ? false
            : undefined;
      }

      const filteredTables = await this.prisma.table.findMany({
        where,
        orderBy: {
          name: 'asc',
        },
      });

      return filteredTables;
    } catch (error) {
      console.error('Error filtering tables:', error);
      throw error;
    }
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

  async deleteListById(idList: number[]) {
    try {
      await this.prisma.table.deleteMany({
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
