import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsEmail,
    IsIn,
    IsOptional,
    IsString,
    MinLength,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProfileDto } from './profile.dto';

export class CreateUserDto {
    @ApiProperty()
    @IsString({ message: 'Tên người dùng không hợp lệ' })
    @IsNotEmpty({ message: 'Tên người dùng không được để trống' })
    username: string;

    @ApiProperty()
    @IsEmail({}, { message: 'Email không hợp lệ' })
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;

    @ApiProperty()
    @IsString({ message: 'Mật khẩu không hợp lệ' })
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    @IsNotEmpty()
    password: string;

    @ApiProperty({ enum: ['user', 'admin'], default: 'user', required: false })
    @IsOptional()
    @IsIn(['user', 'admin'])
    role?: string;

    @ApiProperty({ type: Boolean, required: false, default: true })
    @IsOptional()
    isActive?: boolean;

    @ApiProperty({ required: false, type: ProfileDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => ProfileDto)
    profile?: ProfileDto;
}
