import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type TagDocument = Tag & Document;

export class Tag {
    @ApiProperty()
    @Prop({ required: true, unique: true })
    name: string;

    @ApiProperty()
    @Prop({ required: true, unique: true })
    slug: string;

    @ApiProperty({ required: false })
    @Prop({ required: false })
    description?: string;

    @ApiProperty({ default: 0 })
    @Prop({ default: 0 })
    postCount: number;

    @ApiProperty()
    createdAt?: Date;

    @ApiProperty()
    updatedAt?: Date;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
