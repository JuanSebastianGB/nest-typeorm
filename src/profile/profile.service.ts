import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/users/profile.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}
  async createProfile(userId: number, dto: CreateProfileDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    const newProfile = this.profileRepository.create(dto);
    const savedProfile = await this.profileRepository.save(newProfile);
    user.profile = savedProfile;

    return await this.userRepository.save(user);
  }
}
