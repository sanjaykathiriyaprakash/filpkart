import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('UsersController', () => {
    let controller: UsersController;
    let service: UsersService;

    const mockUser = { id: 'u1', name: 'John Doe', email: 'john@example.com' };
    const mockAddresses = [{ id: 'a1', city: 'Mumbai', pincode: '400001' }];

    const mockUsersService = {
        findOne: jest.fn((id: string) => Promise.resolve(id === 'u1' ? mockUser : null)),
        updateProfile: jest.fn((id: string, dto: any) => Promise.resolve({ ...mockUser, ...dto })),
        changePassword: jest.fn((id: string, dto: any) => Promise.resolve({ message: 'Password changed successfully' })),
        getAddresses: jest.fn((id: string) => Promise.resolve(mockAddresses)),
        createAddress: jest.fn((id: string, dto: any) => Promise.resolve({ id: 'a2', ...dto })),
        updateAddress: jest.fn((userId: string, addressId: string, dto: any) => Promise.resolve({ id: addressId, ...dto })),
        deleteAddress: jest.fn((userId: string, addressId: string) => Promise.resolve({ message: 'Address deleted successfully' })),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
            ],
        })
        .overrideGuard(JwtAuthGuard)
        .useValue({
            canActivate: (context: ExecutionContext) => true,
        })
        .compile();

        controller = module.get<UsersController>(UsersController);
        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should retrieve profile details', async () => {
        const req = { user: { id: 'u1' } };
        const result = await controller.getProfile(req);
        expect(result).toBeDefined();
        expect(result?.id).toEqual('u1');
        expect(mockUsersService.findOne).toHaveBeenCalledWith('u1');
    });

    it('should update profile details', async () => {
        const req = { user: { id: 'u1' } };
        const updateDto = { name: 'John Smith' };
        const result = await controller.updateProfile(req, updateDto);
        expect(result).toBeDefined();
        expect(result.name).toEqual('John Smith');
        expect(mockUsersService.updateProfile).toHaveBeenCalledWith('u1', updateDto);
    });

    it('should change profile password', async () => {
        const req = { user: { id: 'u1' } };
        const passwordDto = { currentPassword: 'password', newPassword: 'newpassword' };
        const result = await controller.changePassword(req, passwordDto);
        expect(result).toBeDefined();
        expect(result.message).toEqual('Password changed successfully');
        expect(mockUsersService.changePassword).toHaveBeenCalledWith('u1', passwordDto);
    });

    it('should get addresses', async () => {
        const req = { user: { id: 'u1' } };
        const result = await controller.getAddresses(req);
        expect(result).toBeDefined();
        expect(result).toHaveLength(1);
        expect(mockUsersService.getAddresses).toHaveBeenCalledWith('u1');
    });

    it('should create a new address', async () => {
        const req = { user: { id: 'u1' } };
        const newAddress = { city: 'Pune', pincode: '411001' };
        const result = await controller.createAddress(req, newAddress);
        expect(result).toBeDefined();
        expect(result.id).toEqual('a2');
        expect(mockUsersService.createAddress).toHaveBeenCalledWith('u1', newAddress);
    });

    it('should update an address', async () => {
        const req = { user: { id: 'u1' } };
        const updateAddressDto = { city: 'Bengaluru', pincode: '560001' };
        const result = await controller.updateAddress(req, 'a1', updateAddressDto);
        expect(result).toBeDefined();
        expect(result.id).toEqual('a1');
        expect(mockUsersService.updateAddress).toHaveBeenCalledWith('u1', 'a1', updateAddressDto);
    });

    it('should delete an address', async () => {
        const req = { user: { id: 'u1' } };
        const result = await controller.deleteAddress(req, 'a1');
        expect(result).toBeDefined();
        expect(result.message).toEqual('Address deleted successfully');
        expect(mockUsersService.deleteAddress).toHaveBeenCalledWith('u1', 'a1');
    });
});
