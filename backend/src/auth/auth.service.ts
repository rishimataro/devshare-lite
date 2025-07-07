import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';
import { comparePasswordHelper } from '../helpers/utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUserName(username);
    const isValidPassword = await comparePasswordHelper(pass, user?.password);
    if (!user || !isValidPassword) {
      throw new UnauthorizedException("Tên đăng nhập hoặc mật khẩu không đúng");
    }
    const payload = { sub: user._id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}