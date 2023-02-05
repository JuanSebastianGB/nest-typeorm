import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, EditUserDto } from './dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async getUsers() {
    const users = await this.userRepository.find({});
    return users;
  }

  async getUserById(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return user;
  }

  async createUser(dto: CreateUserDto) {
    const newUser = this.userRepository.create(dto);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async updateUser(userId: number, dto: EditUserDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new ForbiddenException('user not found');
    return await this.userRepository.update({ id: userId }, { ...dto });
  }

  async deleteUserById(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new ForbiddenException('user not found');
    return await this.userRepository.delete({ id: userId });
  }
}
