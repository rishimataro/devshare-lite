import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
    @ApiProperty({ type: String})
    @Prop({ type: Types.ObjectId, ref: 'Posts', required: true })
    postId: Types.ObjectId;

    @ApiProperty({ type: String })
    @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
    authorId: Types.ObjectId;

    @ApiProperty()
    @Prop({ required: true })
    content: string;

    @ApiProperty({ type: [String], required: false })
    @Prop({ type: [Types.ObjectId], ref: 'Comments', required: false })
    parentId: Types.ObjectId[];

    @ApiProperty({ type: [String] })
    @Prop({ type: [{ type: Types.ObjectId, ref: 'Comments' }], default: [] })
    replies: Types.ObjectId[];

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

export const CommentSchema = SchemaFactory.createForClass(Comment);
