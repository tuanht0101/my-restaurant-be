import {
  Controller,
  Post,
  Delete,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { TableService } from './table.service';
import { CreateTableDto } from './dtos/create-table-dto';
import { UpdateTableDto } from './dtos/update-table-dto';
import { UpdateStatusDto } from './dtos/update-status-dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('table')
export class TableController {
  constructor(private tableService: TableService) {}

  @Post()
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  create(@Body() dto: CreateTableDto) {
    return this.tableService.create(dto);
  }

  @Get()
  getAll() {
    return this.tableService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.tableService.getById(parseInt(id));
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  updateById(@Param('id') id: string, @Body() dto: UpdateTableDto) {
    return this.tableService.updateById(parseInt(id), dto);
  }

  @Patch('updateStatus/:id')
  updateStatusById(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.tableService.updateStatus(parseInt(id), dto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  deleteById(@Param('id') id: string) {
    return this.tableService.deleteById(parseInt(id));
  }
}
