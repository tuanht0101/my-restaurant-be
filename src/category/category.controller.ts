import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Patch,
  Param,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  create(@Body() body: { name: string }) {
    return this.categoryService.create(body.name);
  }

  @Get()
  getAll() {
    return this.categoryService.getAll();
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() body: { name: string }) {
    return this.categoryService.updateOneById(parseInt(id), body.name);
  }
}
