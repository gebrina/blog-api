import {
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
  Controller,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findAll(): Promise<Partial<User>[]> {
    const users = await this.userService.findAll();
    const tempUsers: Partial<User>[] = [];
    users.forEach((user: User) => {
      const { password, ...other } = user;
      tempUsers.push(other);
    });
    return tempUsers;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Partial<User>> {
    const user = await this.userService.findOne(id);
    const { password, ...other } = user;
    return other;
  }

  @Post()
  create(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }

  @Put(':id')
  update(@Body() user: User, @Param('id') id: string): Promise<User> {
    return this.userService.update(id, user);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
