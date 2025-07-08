import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class VerifyAccountDto {
    @IsEmail({}, { message: 'Email phải có định dạng hợp lệ' })
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;

    @IsString({ message: 'Mã xác thực phải là chuỗi' })
    @IsNotEmpty({ message: 'Mã xác thực không được để trống' })
    verificationCode: string;
}
