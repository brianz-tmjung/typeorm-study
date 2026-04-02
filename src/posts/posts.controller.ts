import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { accessTokenGuard } from 'src/auth/gaurd/bearer-token.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 1) GET /posts
  // 모든 post를 다 가져온다
  @Get()
  getPosts() {
    return this.postsService.getAllPosts();
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
    @Body('content') content: string,
    @Body('isPublic', new DefaultValuePipe(true)) isPublic: boolean,
  ) {
    return this.postsService.createPost(req.user.id, title, content);
  }

  // 4) PUT /posts/:id
  // id에 해당하는 post를 변경하거나 생성한다
  @Put(':id')
  putPost(
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
