import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ProfileDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  avatar?: string;
}