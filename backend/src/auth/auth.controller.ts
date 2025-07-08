import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, UseGuards } from '@nestjs/common/decorators';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public } from '../decorator/customize';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("login")
  @Public()
  @UseGuards(LocalAuthGuard)
  async handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @Post("logout")
  async logout(@Request() req) {
    return req.logout();
  }

  @Get("profile")
  getProfile(@Request() req) {
    return req.user;
  }

  @Post("register")
  @Public()
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }
}
