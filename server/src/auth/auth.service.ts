import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async register(authDto: any) {
        const existingUser = await this.usersService.findByEmail(authDto.email);
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(authDto.password, 10);
        const user = await this.usersService.create({
            ...authDto,
            password: hashedPassword,
        });

        // Omit password from return
        const { password, ...result } = user;
        return result;
    }

    async login(loginDto: any) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password!);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { email: user.email, sub: user.id, role: user.role };

        // Generate tokens
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        await this.usersService.update(user.id, { refreshToken });

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                isVerified: user.isVerified
            }
        };
    }

    async refresh(token: string) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.usersService.findOne(payload.sub);
            if (!user || user.refreshToken !== token) {
                throw new UnauthorizedException('Invalid refresh token');
            }
            const newPayload = { email: user.email, sub: user.id, role: user.role };
            return { access_token: this.jwtService.sign(newPayload) };
        } catch {
            throw new UnauthorizedException('Token verification failed');
        }
    }

    async forgotPassword(email: string) {
        const user = await this.usersService.findByEmail(email);
        if (user) {
            const resetToken = Math.random().toString(36).substring(2, 15);
            await this.usersService.update(user.id, { resetPasswordToken: resetToken });
            console.log(`[Email Mock] Reset password token for ${email}: ${resetToken}`);
        }
        return { message: 'If email exists, reset link sent' };
    }

    async resetPassword({ email, token, newPassword }: any) {
        const user = await this.usersService.findByEmail(email);
        if (!user || user.resetPasswordToken !== token) {
            throw new UnauthorizedException('Invalid token');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.usersService.update(user.id, { password: hashedPassword, resetPasswordToken: '' });
        return { message: 'Password reset successful' };
    }

    async sendVerification(email: string) {
        const user = await this.usersService.findByEmail(email);
        if (user && !user.isVerified) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            await this.usersService.update(user.id, { otp });
            console.log(`[Email Mock] Verification OTP for ${email}: ${otp}`);
        }
        return { message: 'OTP sent' };
    }

    async verifyEmail({ email, otp }: any) {
        const user = await this.usersService.findByEmail(email);
        if (!user || user.otp !== otp) {
            throw new UnauthorizedException('Invalid OTP');
        }
        await this.usersService.update(user.id, { isVerified: true, otp: '' });
        return { message: 'Email verified' };
    }
}
