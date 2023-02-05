import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
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
    const users = await this.userRepository.find({
      relations: ['posts', 'profile'],
    });
    return users;
  }

  async getUserById(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['posts', 'profile'],
    });
    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: { username: dto.username },
    });
    if (user)
      throw new HttpException('user already exists', HttpStatus.CONFLICT);
    const newUser = this.userRepository.create(dto);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async updateUser(userId: number, dto: EditUserDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new ForbiddenException('user not found');
    return await this.userRepository.save({ ...user, ...dto });
  }

  async deleteUserById(userId: number) {
    const result = await this.userRepository.delete({ id: userId });
    if (result.affected === 0)
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    return await this.userRepository.delete({ id: userId });
  }
}
