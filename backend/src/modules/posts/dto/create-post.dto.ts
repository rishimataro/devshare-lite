import { IsString, IsOptional, IsEnum, IsArray, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { PostStatus } from '../schemas/post.schema';

export class CreatePostDto {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    content: string;

    @ApiProperty({ enum: PostStatus, required: false, default: PostStatus.DRAFT })
    @IsOptional()
    @IsEnum(PostStatus)
    status?: PostStatus;

    @ApiProperty({ type: [String], required: false })
    @IsOptional()
    @IsArray()
    tags?: string[];

    @ApiProperty({ type: [String], required: false })
    @IsOptional()
    @IsArray()
    @IsUrl({}, { each: true })
    images?: string[];
}
