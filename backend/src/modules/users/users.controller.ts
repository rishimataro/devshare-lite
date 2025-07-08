import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    console.log('Creating user with data:', createUserDto);
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(
    @Query() query: string,
    @Query("currentPage") currentPage: string,
    @Query("pageSize") pageSize: string,
  ) {
    try{
      if (isNaN(+currentPage) || isNaN(+pageSize)) {
        throw new Error('currentPage và pageSize phải là số');
      }
      else{
        return this.usersService.findAll(query, +currentPage, +pageSize);
      }
    } catch (error) {
      console.error('Lỗi:', error);
      throw new Error('Lỗi không xác định');
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
