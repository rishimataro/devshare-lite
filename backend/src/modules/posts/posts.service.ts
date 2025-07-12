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
        const { title, content, tags = [], images = [], status = PostStatus.DRAFT } = createPostDto;

        const post = new this.postModel({
            title,
            content,
            tags,
            images,
            status,
            authorId: new Types.ObjectId(authorId),
            publishedAt: status === PostStatus.PUBLISHED ? new Date() : undefined,
        });

        return post.save();
    }

    async getAllPosts(page: number = 1, limit: number = 10, authorId?: string) {
        const skip = (page - 1) * limit;
        
        const filter: any = {
            status: PostStatus.PUBLISHED // Chỉ hiển thị bài viết đã published
        };
        if (authorId) {
            // Kiểm tra xem authorId có phải là ObjectId không
            if (Types.ObjectId.isValid(authorId)) {
                filter.authorId = new Types.ObjectId(authorId);
            } else {
                // Nếu không phải ObjectId thì tìm user theo username trước
                const userModel = this.postModel.db.model('User');
                const user = await userModel.findOne({ username: authorId });
                if (user) {
                    filter.authorId = user._id;
                } else {
                    // Nếu không tìm thấy user nào thì trả về rỗng
                    return {
                        data: [],
                        pagination: {
                            page,
                            limit,
                            total: 0,
                            totalPages: 0
                        }
                    };
                }
            }
        }
        
        const posts = await this.postModel
            .find(filter)
            .populate('authorId', 'username email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        
        const total = await this.postModel.countDocuments(filter);
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
            .findOne({ 
                _id: id,
                status: PostStatus.PUBLISHED // Chỉ hiển thị bài viết đã published
            })
            .populate('authorId', 'username email');

        if (!post) throw new NotFoundException('Bài viết không tồn tại hoặc chưa được công khai');
        
        // Tăng view count
        post.viewCount += 1;
        await post.save();
        
        return post;
    }

    async findOne(id: string) {
        return this.postModel.findById(id).exec();
    }

    async getPostByIdForOwner(id: string, userId: string) {
        const post = await this.postModel
            .findById(id)
            .populate('authorId', 'username email');

        if (!post) throw new NotFoundException('Bài viết không tồn tại');
        
        // Chỉ chủ sở hữu mới có thể xem bài viết chưa published
        if (post.authorId._id.toString() !== userId && post.status !== PostStatus.PUBLISHED) {
            throw new ForbiddenException('Bạn không có quyền xem bài viết này');
        }
        
        // Tăng view count chỉ khi bài viết đã published
        if (post.status === PostStatus.PUBLISHED) {
            post.viewCount += 1;
            await post.save();
        }
        
        return post;
    }

    async update(postId: string, userId: string, dto: UpdatePostDto) {
        const post = await this.postModel.findById(postId);
        if (!post) throw new NotFoundException('Bài viết không tồn tại');

        if (post.authorId.toString() !== userId)
            throw new ForbiddenException('Bạn không có quyền chỉnh sửa bài viết này');

        if (dto.title !== undefined) post.title = dto.title;
        if (dto.content !== undefined) post.content = dto.content;
        if (dto.tags !== undefined) post.tags = dto.tags;
        if (dto.images !== undefined) post.images = dto.images;
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

    async getPostsByUserId(userId: string) {
        const posts = await this.postModel
            .find({ authorId: new Types.ObjectId(userId) })
            .populate('authorId', 'username email')
            .sort({ createdAt: -1 })
            .exec();
        
        return posts;
    }

    async likePost(postId: string, userId: string) {
        const post = await this.postModel.findById(postId);
        if (!post) throw new NotFoundException('Post not found');

        // Chỉ có thể like bài viết đã published
        if (post.status !== PostStatus.PUBLISHED) {
            throw new ForbiddenException('Không thể like bài viết chưa được công khai');
        }

        const userObjectId = new Types.ObjectId(userId);

        // Nếu đã like thì xoá (unlike)
        const hasLiked = post.likes.some(id => id.toString() === userId);
        if (hasLiked) {
            post.likes = post.likes.filter(id => id.toString() !== userId);
        } else {
            post.likes.push(userObjectId);
        }

        return post.save();
    }
}