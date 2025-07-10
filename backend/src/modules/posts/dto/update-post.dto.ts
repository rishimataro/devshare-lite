import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsMongoId, IsNotEmpty, IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { PostStatus } from '../schemas/post.schema';

export class UpdatePostDto extends PartialType(CreatePostDto) {
    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsEnum(PostStatus)
    status?: PostStatus;

    @IsOptional()
    @IsArray()
    tags?: Types.ObjectId[];
}
