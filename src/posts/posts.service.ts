import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreatePostDto } from './dto';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private usersService: UsersService,
  ) {}
  async createPost(dto: CreatePostDto) {
    await this.usersService.getUserById(dto.authorId);
    const post = this.postRepository.create(dto);
    return await this.postRepository.save(post);
  }
  async getPostById(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!post) throw new HttpException('post not found', HttpStatus.NOT_FOUND);
    return post;
  }
  async getPosts() {
    return await this.postRepository.find({ relations: ['author'] });
  }
}
