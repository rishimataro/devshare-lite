import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: 'Nội dung bình luận' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'ID của bài viết' })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  postId: string;

  @ApiProperty({ description: 'ID của comment cha (nếu là reply)', required: false })
  @IsOptional()
  @IsString()
  @IsMongoId()
  parentId?: string;
}
