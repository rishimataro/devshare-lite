import { IsMongoId, IsOptional, IsString, IsEmail, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ProfileDto } from './profile.dto';

export class UpdateUserDto {
    @IsMongoId({ message: 'ID người dùng không hợp lệ' })
    @IsNotEmpty({ message: 'ID người dùng không được để trống' })
    _id: string;

    @IsOptional()
    @IsString({ message: 'Tên người dùng không hợp lệ' })
    username?: string;

    @IsOptional()
    @IsEmail({}, { message: 'Email không hợp lệ' })
    email?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => ProfileDto)
    profile?: ProfileDto;

    @IsOptional()
    isActive?: boolean;
}
