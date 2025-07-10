import { IsString, IsNotEmpty } from 'class-validator';

export class ResendVerificationDto {
    @IsString({ message: 'ID người dùng phải là chuỗi' })
    @IsNotEmpty({ message: 'ID người dùng không được để trống' })
    userId: string;
}
