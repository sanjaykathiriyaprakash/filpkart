import { Controller, Post, Body, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() registerDto: any) {
        return this.authService.register(registerDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() loginDto: any) {
        return this.authService.login(loginDto);
    }

    @Post('refresh')
    refresh(@Body('token') token: string) {
        return this.authService.refresh(token);
    }

    @Post('forgot-password')
    forgotPassword(@Body('email') email: string) {
        return this.authService.forgotPassword(email);
    }

    @Post('reset-password')
    resetPassword(@Body() resetDto: any) {
        return this.authService.resetPassword(resetDto);
    }

    @Post('send-verification')
    sendVerification(@Body('email') email: string) {
        return this.authService.sendVerification(email);
    }

    @Post('verify-email')
    verifyEmail(@Body() verifyDto: any) {
        return this.authService.verifyEmail(verifyDto);
    }

    @Get('google')
    googleAuth() {
        return { message: 'Redirecting to Google OAuth (Mock)' };
    }

    @Get('google/callback')
    googleAuthCallback() {
        return { message: 'Google OAuth Callback Handled (Mock)' };
    }
}
