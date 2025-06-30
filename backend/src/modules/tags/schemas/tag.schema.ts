import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';

export type TagDocument = HydratedDocument<Tag>;

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
