import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateProfileDto } from './dto';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Post(':userId')
  createProfile(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: CreateProfileDto,
  ) {
    return this.profileService.createProfile(userId, dto);
  }
}
