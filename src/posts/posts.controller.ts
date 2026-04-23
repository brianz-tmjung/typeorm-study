import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { accessTokenGuard } from 'src/auth/gaurd/bearer-token.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 1) GET /posts
  // 모든 post를 다 가져온다
  @Get()
  getPosts(@Query() query: PaginatePostDto) {
    return this.postsService.paginatePosts(query);
  }

  // 2) GET /posts/:id
  // id에 해당하는 post를 가져온다
  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.postsService.getPostById(+id);
  }

  // 3) POST /posts
  // 새로운 post를 생성한다
  @Post()
  @UseGuards(accessTokenGuard)
  postPost(
    @Req() req,
    @Body('title') title: string,
    @Body() body: CreatePostDto,
    // @Body('content') content: string,
    // @Body('isPublic', new DefaultValuePipe(true)) isPublic: boolean,
  ) {
    return this.postsService.createPost(req.user.id, body);
  }

  // 4) PATCH /posts/:id
  // id에 해당하는 post를 변경한다
  @Patch(':id')
  patchPost(
    @Param('id') id: string,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ) {
    return this.postsService.updatePost(+id, title, content);
  }

  // 5) DELETE /posts/:id
  // id에 해당하는 post를 삭제한다
  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(+id);
  }
}
