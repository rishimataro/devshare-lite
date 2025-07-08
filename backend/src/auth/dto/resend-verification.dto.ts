import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendVerificationDto {
    @IsEmail({}, { message: 'Email phải có định dạng hợp lệ' })
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;
}
