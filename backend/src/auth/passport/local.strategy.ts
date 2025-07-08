import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException("Tên đăng nhập hoặc mật khẩu không đúng");
    }
    if(user.isActive === false) {
      throw new UnauthorizedException("Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt tài khoản.");
    }
    return user;
  }
}