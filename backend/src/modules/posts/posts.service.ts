import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostStatus } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Types } from 'mongoose';

@Injectable()
export class PostsService {
    constructor(@InjectModel(Post.name) private postModel: Model<Post>) { }

    async create(createPostDto: CreatePostDto, authorId: string) {
        const { title, content, tags = [], status = PostStatus.DRAFT } = createPostDto;

        const post = new this.postModel({
            title,
            content,
            tags,
            status,
            authorId: new Types.ObjectId(authorId),
            publishedAt: status === PostStatus.PUBLISHED ? new Date() : undefined,
        });

        return post.save();
    }

    async getAllPosts(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const posts = await this.postModel
        .find()
        .populate('authorId', 'name email')
        .populate('tags', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
    
    const total = await this.postModel.countDocuments();
    return {
        data: posts,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
}

    async getPostById(id: string) {
        const post = await this.postModel
            .findByIdAndUpdate(
                id,
                { $inc: { viewCount: 1 } },
                { new: true }
            )
            .populate('authorId', 'name email')
            .populate('tags', 'name');

        if (!post) throw new NotFoundException('Bài viết không tồn tại');
        return post;
    }

    async findOne(id: string) {
        return this.postModel.findById(id).exec();
    }

    async update(postId: string, userId: string, dto: UpdatePostDto) {
        const post = await this.postModel.findById(postId);
        if (!post) throw new NotFoundException('Bài viết không tồn tại');

        if (post.authorId.toString() !== userId)
            throw new ForbiddenException('Bạn không có quyền chỉnh sửa bài viết này');

        if (dto.title !== undefined) post.title = dto.title;
        if (dto.content !== undefined) post.content = dto.content;
        if (dto.tags !== undefined) post.tags = dto.tags;
        if (dto.status !== undefined) {
            post.status = dto.status;
            if (dto.status === PostStatus.PUBLISHED && !post.publishedAt) {
                post.publishedAt = new Date();
            }
        }

        return post.save();
    }

    async remove(id: string, userId: string) {
        const post = await this.postModel.findById(id);
        if (!post) throw new NotFoundException('Bài viết không tồn tại');

        if (post.authorId.toString() !== userId)
            throw new ForbiddenException('Bạn không có quyền xoá bài viết này');

        return post.deleteOne();
    }

    async upvotePost(postId: string, userId: string) {
        const post = await this.postModel.findById(postId);
        if (!post) throw new NotFoundException('Post not found');

        const userObjectId = new Types.ObjectId(userId);

        // Nếu đã upvote thì xoá
        const hasUpvoted = post.upvotes.some(id => id.toString() === userId);
        if (hasUpvoted) {
            post.upvotes = post.upvotes.filter(id => id.toString() !== userId);
        } else {
            post.upvotes.push(userObjectId);
            // loại bỏ nếu có trong downvotes
            post.downvotes = post.downvotes.filter(id => id.toString() !== userId);
        }

        return post.save();
    }

    async downvotePost(postId: string, userId: string) {
        const post = await this.postModel.findById(postId);
        if (!post) throw new NotFoundException('Post not found');

        const userObjectId = new Types.ObjectId(userId);

        const hasDownvoted = post.downvotes.some(id => id.toString() === userId);
        if (hasDownvoted) {
            post.downvotes = post.downvotes.filter(id => id.toString() !== userId);
        } else {
            post.downvotes.push(userObjectId);
            post.upvotes = post.upvotes.filter(id => id.toString() !== userId);
        }

        return post.save();
    }
}