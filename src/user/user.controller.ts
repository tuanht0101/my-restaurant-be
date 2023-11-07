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
import { UserService } from './user.service';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { FilteredUserDto } from './dtos/filtered-user-dto';
import { CurrentUserId } from 'src/common/decorators/current-userId.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('user')
@Serialize(UserDto)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.userService.findOneById(parseInt(id));
  }

  @Post('/filter')
  async findTables(
    @CurrentUserId() id: number,
    @Body() body: FilteredUserDto,
  ): Promise<any[]> {
    return await this.userService.findFilteredUsers(body, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.userService.removeById(parseInt(id));
  }

  @Post('deleteMany')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  deleteListById(@Body() body: { idList: number[] }) {
    return this.userService.deleteListById(body.idList);
  }
}
