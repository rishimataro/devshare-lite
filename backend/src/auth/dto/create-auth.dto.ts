import { IsEmail, IsNotEmpty, Matches } from "class-validator";
import { Transform } from "class-transformer";

export class CreateAuthDto {
    @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
    username: string;

    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    password: string;

    @IsNotEmpty({ message: 'Mật khẩu xác nhận không được để trống' })
    confirmPassword: string;

    @IsNotEmpty({ message: 'Email không được để trống' })
    @IsEmail({}, { message: 'Email không hợp lệ. Vui lòng nhập email đúng định dạng (ví dụ: user@example.com)' })
    email: string;
}
