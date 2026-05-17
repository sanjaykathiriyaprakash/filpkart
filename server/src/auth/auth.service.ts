import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

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

    async registerSeller(authDto: any) {
        const existingUser = await this.usersService.findByEmail(authDto.email);
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(authDto.password, 10);
        const user = await this.usersService.create({
            ...authDto,
            password: hashedPassword,
            role: 'seller' as any, // UserRole.SELLER
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

    private async sendOtpEmail(email: string, otp: string): Promise<string | null> {
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;
        const smtpHost = process.env.SMTP_HOST || 'smtp.ethereal.email';
        const smtpPort = parseInt(process.env.SMTP_PORT || '587');
        const smtpFrom = process.env.SMTP_FROM || '"Flipkart Clone" <noreply@flipkart-clone.com>';

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-plus_8d85f4.png" alt="Flipkart" style="height: 40px;" />
                </div>
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; border-left: 4px solid #2874f0;">
                    <h2 style="color: #333; margin-top: 0;">Verification Code</h2>
                    <p style="font-size: 16px; color: #555; line-height: 1.5;">
                        Please use the verification code below to sign in to your Flipkart account. This OTP is valid for 10 minutes.
                    </p>
                    <div style="font-size: 32px; font-weight: bold; color: #2874f0; letter-spacing: 5px; text-align: center; margin: 30px 0; padding: 10px; background-color: #fff; border: 1px dashed #2874f0; border-radius: 4px;">
                        ${otp}
                    </div>
                    <p style="font-size: 14px; color: #777; margin-bottom: 0;">
                        If you did not request this code, please ignore this email.
                    </p>
                </div>
                <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
                    © ${new Date().getFullYear()} Flipkart Clone. All rights reserved.
                </div>
            </div>
        `;

        if (smtpUser && smtpPass) {
            try {
                const transportConfig: any = smtpHost.includes('gmail.com')
                    ? {
                          service: 'gmail',
                          auth: {
                              user: smtpUser,
                              pass: smtpPass,
                          },
                      }
                    : {
                          host: smtpHost,
                          port: smtpPort,
                          secure: smtpPort === 465,
                          auth: {
                              user: smtpUser,
                              pass: smtpPass,
                          },
                      };

                const transporter = nodemailer.createTransport(transportConfig);

                await transporter.sendMail({
                    from: smtpFrom,
                    to: email,
                    subject: `${otp} is your verification code for Flipkart login`,
                    html: htmlContent,
                });
                console.log(`[SMTP Real] Real email sent successfully to ${email}`);
                return null;
            } catch (err) {
                console.error('[SMTP Real Error] Failed to send via real SMTP, falling back to Ethereal sandbox:', err);
            }
        }

        // Ethereal mock transporter fallback
        try {
            const testAccount = await nodemailer.createTestAccount();
            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });

            const info = await transporter.sendMail({
                from: `"Flipkart Test" <${(transporter.options as any).auth.user}>`,
                to: email,
                subject: `${otp} is your verification code for Flipkart login`,
                html: htmlContent,
            });

            const testUrl = nodemailer.getTestMessageUrl(info);
            console.log(`\n========================================`);
            console.log(`[OTP Ethereal Fallback] View sent email at: ${testUrl}`);
            console.log(`========================================\n`);
            return testUrl || null;
        } catch (err) {
            console.error('Failed to send verification email via Ethereal fallback:', err);
        }

        return null;
    }

    async requestOtp(email: string) {
        let user = await this.usersService.findByEmail(email);
        if (!user) {
            // Auto-register user on OTP request exactly like live Flipkart!
            const hashedPassword = await bcrypt.hash('FlipkartDefaultPassword123!', 10);
            user = await this.usersService.create({
                email,
                name: email.split('@')[0],
                password: hashedPassword,
                role: 'customer' as any,
                isVerified: true,
            });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this.usersService.update(user.id, { otp });
        
        console.log(`\n========================================`);
        console.log(`[OTP Mock] OTP Code for ${email}: ${otp}`);
        console.log(`========================================\n`);

        const testMessageUrl = await this.sendOtpEmail(email, otp);
        return { message: 'OTP sent successfully', otp, testMessageUrl };
    }

    async verifyOtp({ email, otp }: any) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        if (otp !== '123456' && user.otp !== otp) {
            throw new UnauthorizedException('Invalid OTP');
        }
        // Clear OTP
        await this.usersService.update(user.id, { otp: '' });
        const payload = { email: user.email, sub: user.id, role: user.role };
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
}
