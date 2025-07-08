import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';
import { comparePasswordHelper } from '../helpers/utils';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from 'src/modules/users/schemas/user.schema';
import { CreateAuthDto } from './dto/create-auth.dto';
import { VerifyAccountDto } from './dto/verify-account.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUserName(username);
    const isValidPassword = await comparePasswordHelper(pass, user?.password);
    if (!user || !isValidPassword) {
      return null;
    }
    return user;
  }

  async login(user: UserDocument): Promise<{ access_token: string }> {
    const payload = { sub: user._id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  checkPasswordMatch(password: string, confirmPassword: string): boolean {
    if (!password || !confirmPassword) {
      throw new BadRequestException("Mật khẩu và mật khẩu xác nhận không được để trống");
    }
    if (password !== confirmPassword) {
      throw new BadRequestException("Mật khẩu và mật khẩu xác nhận không khớp");
    }
    return true;
  }

  async handleRegister(registerDto: CreateAuthDto) {
    if (!registerDto) {
      throw new BadRequestException('Dữ liệu đăng ký không hợp lệ');
    }
    
    // Check if passwords match
    this.checkPasswordMatch(registerDto.password, registerDto.confirmPassword);
    
    return await this.usersService.handleRegister(registerDto);
  }

  async verifyAccount(verifyAccountDto: VerifyAccountDto) {
    const { email, verificationCode } = verifyAccountDto;
    
    // Find user by email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Không tìm thấy tài khoản với email này');
    }

    // Check if account is already verified
    if (user.isActive) {
      throw new BadRequestException('Tài khoản đã được kích hoạt');
    }

    // Check if verification code is valid
    if (!user.isCodeValid(verificationCode)) {
      if (user.isCodeExpired()) {
        throw new BadRequestException('Mã xác thực đã hết hạn. Vui lòng yêu cầu mã mới');
      }
      throw new BadRequestException('Mã xác thực không hợp lệ');
    }

    // Activate account
    await this.usersService.activateAccount(user._id.toString());

    return {
      message: 'Xác thực tài khoản thành công. Tài khoản của bạn đã được kích hoạt'
    };
  }

  async resendVerification(resendVerificationDto: ResendVerificationDto) {
    const { email } = resendVerificationDto;
    
    // Find user by email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Không tìm thấy tài khoản với email này');
    }

    // Check if account is already verified
    if (user.isActive) {
      throw new BadRequestException('Tài khoản đã được kích hoạt');
    }

    // Resend verification code
    await this.usersService.resendVerificationCode(user._id.toString());

    return {
      message: 'Mã xác thực mới đã được gửi đến email của bạn'
    };
  }

/*   async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUserName(username);
    const isValidPassword = await comparePasswordHelper(pass, user?.password);
    if (!user || !isValidPassword) {
      throw new UnauthorizedException("Tên đăng nhập hoặc mật khẩu không đúng");
    }
    const payload = { sub: user._id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  } */

}