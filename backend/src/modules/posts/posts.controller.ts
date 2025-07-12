import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Query, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../../auth/passport/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../decorator/customize';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    create(@Body() createPostDto: CreatePostDto, @Request() req: any) {
        console.log('Creating post with data:', createPostDto);
        const authorId = req.user?._id;
        return this.postsService.create(createPostDto, authorId);
    }

    @Public()
    @Get()
    findAll(
        @Query('page') page?: number, 
        @Query('limit') limit?: number,
        @Query('authorId') authorId?: string
    ) {
        return this.postsService.getAllPosts(page, limit, authorId);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('me')
    findMyPosts(@Request() req: any) {
        const userId = req.user?._id;
        return this.postsService.getPostsByUserId(userId);
    }

    @Public()
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.postsService.getPostById(id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get(':id/owner')
    findOneForOwner(@Param('id') id: string, @Request() req: any) {
        const userId = req.user?._id;
        return this.postsService.getPostByIdForOwner(id, userId);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @Request() req: any) {
        console.log('Updating post with ID:', id, 'and data:', updatePostDto);
        const userId = req.user?._id;
        return this.postsService.update(id, userId, updatePostDto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete(':id')
    remove(@Param('id') id: string, @Request() req: any) {
        const userId = req.user?._id;
        return this.postsService.remove(id, userId);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post(':id/like')
    async like(@Param('id') id: string, @Req() req: any) {
        const user = req.user as any;
        return this.postsService.likePost(id, user._id);
    }

}
