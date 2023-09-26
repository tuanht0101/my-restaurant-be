import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateProductDto } from './dtos/create-product-dto';
import { UpdateProductDto } from './dtos/update-product-dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  create(@Body() body: CreateProductDto) {
    return this.productService.create(body);
  }

  @Get()
  getAll() {
    return this.productService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.productService.getById(parseInt(id));
  }

  @Get('/getByCategory/:id')
  getByCategory(@Param('id') id: string) {
    return this.productService.getByCategory(parseInt(id));
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return this.productService.update(parseInt(id), body);
  }

  @Patch('updateStatus/:id')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.productService.updateStatus(parseInt(id), body.status);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  delete(@Param('id') id: string) {
    return this.productService.delete(parseInt(id));
  }
}
