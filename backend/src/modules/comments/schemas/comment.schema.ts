import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
    @ApiProperty({ type: String})
    @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
    postId: Types.ObjectId;

    @ApiProperty({ type: String })
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    authorId: Types.ObjectId;

    @ApiProperty()
    @Prop({ required: true })
    content: string;

    @ApiProperty({ type: [String], required: false })
    @Prop({ type: [Types.ObjectId], ref: 'Comment', required: false })
    parentId: Types.ObjectId[];

    @ApiProperty({ type: [String] })
    @Prop({ type: [{ type: Types.ObjectId, ref: 'Comment' }], default: [] })
    replies: Types.ObjectId[];

    @ApiProperty({ type: [String] })
    @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
    upvotes: Types.ObjectId[];

    @ApiProperty({ type: [String] })
    @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
    downvotes: Types.ObjectId[];

    @ApiProperty()
    createdAt?: Date;

    @ApiProperty()
    updatedAt?: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
