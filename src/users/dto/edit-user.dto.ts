import { IsOptional, IsString } from 'class-validator';
export class EditUserDto {
  @IsString()
  @IsOptional()
  username?: string;
  @IsString()
  @IsOptional()
  password?: string;
}
