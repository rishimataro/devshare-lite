import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

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
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    authorId: Types.ObjectId;

    @ApiProperty({ enum: PostStatus, default: PostStatus.DRAFT })
    @Prop({ type: String, enum: PostStatus, default: PostStatus.DRAFT })
    status: PostStatus;

    @ApiProperty({ type: [String] })
    @Prop({ type: [String], default: [] })
    tags: string[];

    @ApiProperty({ type: [String] })
    @Prop({ type: [String], default: [] })
    images: string[];

    @ApiProperty({ required: false })
    @Prop({ required: false })
    publishedAt?: Date;

    @ApiProperty({ default: 0 })
    @Prop({ default: 0 })
    viewCount: number;

    @ApiProperty({ type: [String] })
    @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
    likes: Types.ObjectId[];

    @ApiProperty()
    createdAt?: Date;

    @ApiProperty()
    updatedAt?: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);