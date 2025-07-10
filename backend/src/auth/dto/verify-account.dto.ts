import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class VerifyAccountDto {
    @IsString({ message: 'ID người dùng phải là chuỗi' })
    @IsNotEmpty({ message: 'ID người dùng không được để trống' })
    userId: string;

    @IsString({ message: 'Mã xác thực phải là chuỗi' })
    @IsNotEmpty({ message: 'Mã xác thực không được để trống' })
    verificationCode: string;
}
