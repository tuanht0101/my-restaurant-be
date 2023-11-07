import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  create(@Body() body: { name: string }) {
    return this.categoryService.create(body.name);
  }

  @Get()
  getAll() {
    return this.categoryService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.categoryService.findOneById(parseInt(id));
  }

  @Post('/filter')
  async findTables(@Body() body: { name: string }): Promise<any[]> {
    return await this.categoryService.findFilteredDatas(body.name);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: { name: string }) {
    return this.categoryService.updateOneById(parseInt(id), body.name);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.categoryService.removeById(parseInt(id));
  }

  @Post('deleteMany')
  deleteListById(@Body() body: { idList: number[] }) {
    return this.categoryService.deleteListById(body.idList);
  }
}
