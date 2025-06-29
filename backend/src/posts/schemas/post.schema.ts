import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type PostDocument = Post & Document;

export enum PostStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    ARCHIVED = 'archived',
}

@Schema({ timestamps: true })
export class Post {
    @ApiProperty()
    @Prop({ required: true })
    title: string;

    @ApiProperty()
    @Prop({ required: true })
    content: string;

    @ApiProperty()
    @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
    authorId: Types.ObjectId;

    @ApiProperty({ enum: PostStatus, default: PostStatus.DRAFT })
    @Prop({ type: String, enum: PostStatus, default: PostStatus.DRAFT })
    status: PostStatus;

    @ApiProperty({ type: [String] })
    @Prop({ type: Types.ObjectId, ref: 'Tags', default: [] })
    tags: Types.ObjectId[];

    @ApiProperty({ required: false })
    @Prop({ required: false })
    publishedAt?: Date;

    @ApiProperty({ default: 0 })
    @Prop({ default: 0 })
    viewCount: number;

    @ApiProperty({ type: [String] })
    @Prop({ type: [Types.ObjectId], ref: 'Users', default: [] })
    upvotes: Types.ObjectId[];

    @ApiProperty({ type: [String] })
    @Prop({ type: [Types.ObjectId], ref: 'Users', default: [] })
    downvotes: Types.ObjectId[];

    @ApiProperty()
    createdAt?: Date;

    @ApiProperty()
    updatedAt?: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);