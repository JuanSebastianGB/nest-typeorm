import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateProfileDto } from 'src/profile/dto';
import { ProfileService } from 'src/profile/profile.service';
import { CreateUserDto, EditUserDto } from './dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private profileService: ProfileService,
  ) {}
  @Get()
  getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }
  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) userId: number): Promise<User> {
    return this.usersService.getUserById(userId);
  }
  @HttpCode(HttpStatus.CREATED)
  @Post()
  createUser(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(dto);
  }
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto: EditUserDto,
  ) {
    return this.usersService.updateUser(userId, dto);
  }
  @Delete(':id')
  deleteUserById(@Param('id', ParseIntPipe) userId: number) {
    return this.usersService.deleteUserById(userId);
  }

  @Post(':id/profile')
  createUserProfile(
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto: CreateProfileDto,
  ) {
    return this.profileService.createProfile(userId, dto);
  }
}
