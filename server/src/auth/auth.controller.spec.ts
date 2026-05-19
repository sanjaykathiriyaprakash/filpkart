import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpStatus } from '@nestjs/common';

describe('AuthController', () => {
    let controller: AuthController;
    let service: AuthService;

    const mockAuthService = {
        register: jest.fn((dto) => Promise.resolve({ id: '1', email: dto.email, name: dto.name, role: 'customer' })),
        registerSeller: jest.fn((dto) => Promise.resolve({ id: '2', email: dto.email, name: dto.name, role: 'seller' })),
        login: jest.fn((dto) => Promise.resolve({ accessToken: 'access-token', user: { email: dto.email } })),
        refresh: jest.fn((token) => Promise.resolve({ accessToken: 'new-access-token' })),
        forgotPassword: jest.fn((email) => Promise.resolve({ message: 'Password reset link sent' })),
        resetPassword: jest.fn((dto) => Promise.resolve({ message: 'Password reset successful' })),
        sendVerification: jest.fn((email) => Promise.resolve({ message: 'Verification link sent' })),
        verifyEmail: jest.fn((dto) => Promise.resolve({ message: 'Email verified successfully' })),
        requestOtp: jest.fn((email) => Promise.resolve({ message: 'OTP sent successfully' })),
        verifyOtp: jest.fn((dto) => Promise.resolve({ accessToken: 'otp-access-token', user: { email: dto.email } })),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should register a new customer', async () => {
        const dto = { email: 'test@example.com', name: 'John Doe', password: 'password' };
        const result = await controller.register(dto);
        expect(result).toBeDefined();
        expect(result.role).toEqual('customer');
        expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });

    it('should register a new seller', async () => {
        const dto = { email: 'seller@example.com', name: 'Seller Store', password: 'password' };
        const result = await controller.registerSeller(dto);
        expect(result).toBeDefined();
        expect(result.role).toEqual('seller');
        expect(mockAuthService.registerSeller).toHaveBeenCalledWith(dto);
    });

    it('should log in a user', async () => {
        const dto = { email: 'test@example.com', password: 'password' };
        const result = await controller.login(dto);
        expect(result).toBeDefined();
        expect(result.accessToken).toEqual('access-token');
        expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    });

    it('should refresh authentication token', async () => {
        const result = await controller.refresh('some-refresh-token');
        expect(result).toBeDefined();
        expect(result.accessToken).toEqual('new-access-token');
        expect(mockAuthService.refresh).toHaveBeenCalledWith('some-refresh-token');
    });

    it('should trigger forgot password procedure', async () => {
        const result = await controller.forgotPassword('test@example.com');
        expect(result).toBeDefined();
        expect(result.message).toEqual('Password reset link sent');
        expect(mockAuthService.forgotPassword).toHaveBeenCalledWith('test@example.com');
    });

    it('should reset password', async () => {
        const dto = { token: 'reset-token', password: 'newpassword' };
        const result = await controller.resetPassword(dto);
        expect(result).toBeDefined();
        expect(result.message).toEqual('Password reset successful');
        expect(mockAuthService.resetPassword).toHaveBeenCalledWith(dto);
    });

    it('should request and verify email OTP', async () => {
        const requestResult = await controller.requestOtp('test@example.com');
        expect(requestResult).toBeDefined();
        expect(mockAuthService.requestOtp).toHaveBeenCalledWith('test@example.com');

        const verifyDto = { email: 'test@example.com', otp: '123456' };
        const verifyResult = await controller.verifyOtp(verifyDto);
        expect(verifyResult).toBeDefined();
        expect(verifyResult.accessToken).toEqual('otp-access-token');
        expect(mockAuthService.verifyOtp).toHaveBeenCalledWith(verifyDto);
    });

    it('should handle mock Google OAuth URLs', () => {
        expect(controller.googleAuth()).toEqual({ message: 'Redirecting to Google OAuth (Mock)' });
        expect(controller.googleAuthCallback()).toEqual({ message: 'Google OAuth Callback Handled (Mock)' });
    });
});
