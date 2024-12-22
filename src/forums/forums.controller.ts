import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { ForumsService } from './forums.service';
import { CreateForumDto } from './create-forum.dto';
import { CreatePostDto } from './create-post.dto';
import { CreateReplyDto } from './create-reply.dto';
import { SearchQueryDto } from './searchQuery.dto';

@Controller('forums')
export class ForumsController {
  constructor(private readonly forumsService: ForumsService) {}

  // Create a new forum topic
  @Post('create')
  async createForum(@Body() createForumDto: CreateForumDto) {
    return this.forumsService.createForum(createForumDto);
  }

  // Create a new post in a forum
  @Post('create-post')
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.forumsService.createPost(createPostDto);
  }

  // Add a reply to a post
  @Post('add-reply')
  async addReply(@Body() createReplyDto: CreateReplyDto) {
    return this.forumsService.addReply(createReplyDto);
  }

  // Get all posts in a forum
  @Get(':forumId/posts')
  async getForumPosts(@Param('forumId') forumId: string) {
    return this.forumsService.getForumPosts(forumId);
  }

  // Search posts across forums
  @Get('search')
  async searchPosts(@Body() searchQueryDto: SearchQueryDto) {
    return this.forumsService.searchPosts(searchQueryDto.query);
  }
}
