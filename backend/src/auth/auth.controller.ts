import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, UseGuards } from '@nestjs/common/decorators';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public } from '../decorator/customize';
import { CreateAuthDto } from './dto/create-auth.dto';
import { VerifyAccountDto } from './dto/verify-account.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly mailerService: MailerService
    ) { }

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

    @Post("verify-account")
    @Public()
    verifyAccount(@Body() verifyAccountDto: VerifyAccountDto) {
        return this.authService.verifyAccount(verifyAccountDto);
    }

    @Post("resend-verification")
    @Public()
    resendVerification(@Body() resendVerificationDto: ResendVerificationDto) {
        return this.authService.resendVerification(resendVerificationDto);
    }

    @Get("send-email")
    @Public()
    sendEmail() {
        this.mailerService
            .sendMail({
                to: 'ngocthaodana@gmail.com',
                subject: 'Xác nhận đăng ký tài khoản DevShare',
                text: 'Xác nhận',
                template: "verify-code-email",
                context: {
                    username: "taro123",
                    verificationCode: "123456",
                    app_name: "DevShare",
                    name: "Nguyễn Thái Ngọc Thảo",
                    currentYear: new Date().getFullYear(),
                    address: "154 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng",
                    supportEmail: "support@devshare.com",
                    supportPhone: "0123456789",
                    expiration_minutes: 60
                }
            })
        return "hello";
    }
}
