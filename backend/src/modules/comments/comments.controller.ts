import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../../auth/passport/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../decorator/customize';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @Request() req: any) {
    const authorId = req.user?._id;
    return this.commentsService.create(createCommentDto, authorId);
  }

  @Public()
  @Get('post/:postId')
  findByPostId(
    @Param('postId') postId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return this.commentsService.findByPostId(postId, page, limit);
  }

  @Public()
  @Get(':id/replies')
  findReplies(@Param('id') id: string) {
    return this.commentsService.findReplies(id);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @Request() req: any) {
    const userId = req.user?._id;
    return this.commentsService.update(id, updateCommentDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?._id;
    return this.commentsService.remove(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/upvote')
  upvote(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?._id;
    return this.commentsService.upvoteComment(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/downvote')
  downvote(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?._id;
    return this.commentsService.downvoteComment(id, userId);
  }
}
