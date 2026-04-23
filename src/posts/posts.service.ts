import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsModel } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
    private readonly commonService: CommonService,
  ) {}

  // 1) GET /posts
  async getAllPosts() {
    return this.postsRepository.find({
      relations: ['author'],
    });
  }

  // GET /posts/paginate
  async paginatePosts(dto: PaginatePostDto) {
    return this.commonService.paginate(dto, this.postsRepository, {
      relations: ['author'],
    }, '/posts');
  }

  // 2) GET /posts/:id
  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  // 3) POST /posts
  async createPost(authorId: number, postDto: CreatePostDto) {
    const post = this.postsRepository.create({
      author: {
        id: authorId,
      },
      ...postDto,
      likeCount: 0,
      commentCount: 0,
    });
    return this.postsRepository.save(post);
  }

  // 4) PUT /posts/:id
  async updatePost(id: number, title?: string, content?: string) {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException();
    }
    const updatedPost = this.postsRepository.create({
      ...post,
      ...(title && { title }),
      ...(content && { content }),
    });
    const newPost = this.postsRepository.save(updatedPost);
    return newPost;
  }

  // 5) DELETE /posts/:id
  async deletePost(id: number) {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException();
    }
    await this.postsRepository.remove(post);
    return { id };
  }
}
