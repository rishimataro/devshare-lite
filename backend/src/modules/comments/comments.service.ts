import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Post, PostStatus } from '../posts/schemas/post.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Post.name) private postModel: Model<Post>
  ) {}

  async create(createCommentDto: CreateCommentDto, authorId: string) {
    const { content, postId, parentId } = createCommentDto;

    // Validate postId and authorId are valid ObjectIds
    if (!Types.ObjectId.isValid(postId)) {
      throw new NotFoundException('Invalid post ID');
    }
    if (!Types.ObjectId.isValid(authorId)) {
      throw new NotFoundException('Invalid author ID');
    }
    if (parentId && !Types.ObjectId.isValid(parentId)) {
      throw new NotFoundException('Invalid parent comment ID');
    }

    // Kiểm tra bài viết có tồn tại và có phải là published không
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new NotFoundException('Bài viết không tồn tại');
    }
    if (post.status !== PostStatus.PUBLISHED) {
      throw new ForbiddenException('Không thể bình luận trên bài viết chưa được công khai');
    }

    const comment = new this.commentModel({
      content,
      postId: new Types.ObjectId(postId),
      authorId: new Types.ObjectId(authorId),
      parentId: parentId ? [new Types.ObjectId(parentId)] : []
    });

    const savedComment = await comment.save();
    
    // Nếu đây là reply, thêm vào danh sách replies của parent comment
    if (parentId) {
      await this.commentModel.findByIdAndUpdate(
        parentId,
        { $push: { replies: savedComment._id } }
      );
    }

    return savedComment.populate('authorId', 'username email profile');
  }

  async findByPostId(postId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    // Validate postId is a valid ObjectId
    if (!Types.ObjectId.isValid(postId)) {
      throw new NotFoundException('Invalid post ID');
    }
    
    // Chỉ lấy comments gốc (không có parentId)
    const comments = await this.commentModel
      .find({ 
        postId: new Types.ObjectId(postId), 
        $or: [
          { parentId: { $exists: false } }, 
          { parentId: { $size: 0 } }
        ] 
      })
      .populate('authorId', 'username email profile')
      .populate({
        path: 'replies',
        populate: {
          path: 'authorId',
          select: 'username email profile'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.commentModel.countDocuments({ 
      postId: new Types.ObjectId(postId),
      $or: [
        { parentId: { $exists: false } }, 
        { parentId: { $size: 0 } }
      ]
    });

    return {
      data: comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findReplies(commentId: string) {
    const comment = await this.commentModel
      .findById(commentId)
      .populate({
        path: 'replies',
        populate: {
          path: 'authorId',
          select: 'username email profile'
        }
      })
      .exec();

    if (!comment) {
      throw new NotFoundException('Comment không tồn tại');
    }

    return comment.replies;
  }

  async findOne(id: string) {
    const comment = await this.commentModel
      .findById(id)
      .populate('authorId', 'username email profile')
      .populate({
        path: 'replies',
        populate: {
          path: 'authorId',
          select: 'username email profile'
        }
      })
      .exec();

    if (!comment) {
      throw new NotFoundException('Comment không tồn tại');
    }

    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string) {
    const comment = await this.commentModel.findById(id);
    if (!comment) {
      throw new NotFoundException('Comment không tồn tại');
    }

    if (comment.authorId.toString() !== userId) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa comment này');
    }

    const updatedComment = await this.commentModel
      .findByIdAndUpdate(id, updateCommentDto, { new: true })
      .populate('authorId', 'username email profile')
      .exec();

    return updatedComment;
  }

  async remove(id: string, userId: string) {
    const comment = await this.commentModel.findById(id);
    if (!comment) {
      throw new NotFoundException('Comment không tồn tại');
    }

    if (comment.authorId.toString() !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa comment này');
    }

    // Xóa comment khỏi danh sách replies của parent nếu có
    if (comment.parentId && comment.parentId.length > 0) {
      await this.commentModel.findByIdAndUpdate(
        comment.parentId[0],
        { $pull: { replies: comment._id } }
      );
    }

    // Xóa tất cả replies của comment này
    await this.commentModel.deleteMany({ parentId: { $in: [comment._id] } });

    return comment.deleteOne();
  }

  async upvoteComment(commentId: string, userId: string) {
    // Validate commentId and userId are valid ObjectIds
    if (!Types.ObjectId.isValid(commentId)) {
      throw new NotFoundException('Invalid comment ID');
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user ID');
    }

    const comment = await this.commentModel.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment không tồn tại');
    }

    const userObjectId = new Types.ObjectId(userId);
    const hasUpvoted = comment.upvotes.some(id => id.toString() === userId);
    const hasDownvoted = comment.downvotes.some(id => id.toString() === userId);

    if (hasUpvoted) {
      // Nếu đã upvote thì xóa upvote
      comment.upvotes = comment.upvotes.filter(id => id.toString() !== userId);
    } else {
      // Nếu chưa upvote thì thêm upvote
      comment.upvotes.push(userObjectId);
      // Nếu đã downvote thì xóa downvote
      if (hasDownvoted) {
        comment.downvotes = comment.downvotes.filter(id => id.toString() !== userId);
      }
    }

    return comment.save();
  }

  async downvoteComment(commentId: string, userId: string) {
    // Validate commentId and userId are valid ObjectIds
    if (!Types.ObjectId.isValid(commentId)) {
      throw new NotFoundException('Invalid comment ID');
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user ID');
    }

    const comment = await this.commentModel.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment không tồn tại');
    }

    const userObjectId = new Types.ObjectId(userId);
    const hasDownvoted = comment.downvotes.some(id => id.toString() === userId);
    const hasUpvoted = comment.upvotes.some(id => id.toString() === userId);

    if (hasDownvoted) {
      // Nếu đã downvote thì xóa downvote
      comment.downvotes = comment.downvotes.filter(id => id.toString() !== userId);
    } else {
      // Nếu chưa downvote thì thêm downvote
      comment.downvotes.push(userObjectId);
      // Nếu đã upvote thì xóa upvote
      if (hasUpvoted) {
        comment.upvotes = comment.upvotes.filter(id => id.toString() !== userId);
      }
    }

    return comment.save();
  }
}
