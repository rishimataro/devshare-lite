import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({ description: 'Nội dung bình luận mới', required: false })
  @IsOptional()
  @IsString()
  content?: string;
}
