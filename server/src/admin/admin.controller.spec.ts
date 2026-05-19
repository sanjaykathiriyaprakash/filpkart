import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ExecutionContext } from '@nestjs/common';
import { UserRole } from '../users/entities/user.entity';

describe('AdminController', () => {
    let controller: AdminController;
    let service: AdminService;

    const mockStats = { revenue: 100000, orders: 150 };
    const mockUsers = [{ id: 'u1', name: 'John', role: UserRole.CUSTOMER }];
    const mockSellers = [{ id: 's1', name: 'Store', role: UserRole.SELLER }];
    const mockProducts = [{ id: 'p1', title: 'Phone', status: 'pending' }];
    const mockOrders = [{ id: 'o1', status: 'Placed' }];
    const mockCoupons = [{ id: 'c1', code: 'SAVE10' }];
    const mockBanners = [{ id: 'b1', title: 'Sale Banner' }];

    const mockAdminService = {
        getDashboardStats: jest.fn(() => Promise.resolve(mockStats)),
        getAllUsers: jest.fn(() => Promise.resolve(mockUsers)),
        getAllSellers: jest.fn(() => Promise.resolve(mockSellers)),
        getAllProducts: jest.fn(() => Promise.resolve(mockProducts)),
        getPendingProducts: jest.fn(() => Promise.resolve(mockProducts)),
        approveProduct: jest.fn((id: string) => Promise.resolve({ id, status: 'approved' })),
        rejectProduct: jest.fn((id: string) => Promise.resolve({ message: 'Product rejected' })),
        updateUserRole: jest.fn((id: string, role: UserRole) => Promise.resolve({ id, role })),
        getAllOrders: jest.fn(() => Promise.resolve(mockOrders)),
        updateOrderStatus: jest.fn((id: string, status: any) => Promise.resolve({ id, status })),
        getAllCoupons: jest.fn(() => Promise.resolve(mockCoupons)),
        createCoupon: jest.fn((dto: any) => Promise.resolve({ id: 'c2', ...dto })),
        updateCoupon: jest.fn((id: string, dto: any) => Promise.resolve({ id, ...dto })),
        deleteCoupon: jest.fn((id: string) => Promise.resolve({ message: 'Coupon deleted' })),
        getAllBanners: jest.fn(() => Promise.resolve(mockBanners)),
        createBanner: jest.fn((dto: any) => Promise.resolve({ id: 'b2', ...dto })),
        updateBanner: jest.fn((id: string, dto: any) => Promise.resolve({ id, ...dto })),
        deleteBanner: jest.fn((id: string) => Promise.resolve({ message: 'Banner deleted' })),
        getSalesReport: jest.fn(() => Promise.resolve({ sales: [] })),
        getInventoryReport: jest.fn(() => Promise.resolve({ inventory: [] })),
        toggleUserVerification: jest.fn((id: string, isVerified: boolean) => Promise.resolve({ id, isVerified })),
        createUser: jest.fn((dto: any) => Promise.resolve({ id: 'u2', ...dto })),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AdminController],
            providers: [
                {
                    provide: AdminService,
                    useValue: mockAdminService,
                },
            ],
        })
        .overrideGuard(JwtAuthGuard)
        .useValue({ canActivate: (context: ExecutionContext) => true })
        .overrideGuard(RolesGuard)
        .useValue({ canActivate: (context: ExecutionContext) => true })
        .compile();

        controller = module.get<AdminController>(AdminController);
        service = module.get<AdminService>(AdminService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should fetch admin stats', async () => {
        const result = await controller.getStats();
        expect(result).toEqual(mockStats);
    });

    it('should fetch lists of users and sellers', async () => {
        expect(await controller.getAllUsers()).toEqual(mockUsers);
        expect(await controller.getAllSellers()).toEqual(mockSellers);
    });

    it('should approve or reject product listings', async () => {
        expect(await controller.approveProduct('p1')).toEqual({ id: 'p1', status: 'approved' });
        expect(await controller.rejectProduct('p1')).toEqual({ message: 'Product rejected' });
    });

    it('should update user roles', async () => {
        expect(await controller.updateRole('u1', UserRole.SELLER)).toEqual({ id: 'u1', role: UserRole.SELLER });
    });

    it('should fetch and update order status', async () => {
        expect(await controller.getAllOrders()).toEqual(mockOrders);
        expect(await controller.updateOrderStatus('o1', 'Delivered')).toEqual({ id: 'o1', status: 'Delivered' });
    });

    it('should handle coupon CRUD operations', async () => {
        expect(await controller.getCoupons()).toEqual(mockCoupons);
        expect(await controller.createCoupon({ code: 'NEW10' })).toEqual({ id: 'c2', code: 'NEW10' });
        expect(await controller.updateCoupon('c1', { code: 'SAVE15' })).toEqual({ id: 'c1', code: 'SAVE15' });
        expect(await controller.deleteCoupon('c1')).toEqual({ message: 'Coupon deleted' });
    });

    it('should handle banner CRUD operations', async () => {
        expect(await controller.getBanners()).toEqual(mockBanners);
        expect(await controller.createBanner({ title: 'New Banner' })).toEqual({ id: 'b2', title: 'New Banner' });
        expect(await controller.updateBanner('b1', { title: 'Updated Banner' })).toEqual({ id: 'b1', title: 'Updated Banner' });
        expect(await controller.deleteBanner('b1')).toEqual({ message: 'Banner deleted' });
    });

    it('should retrieve custom analytical reports', async () => {
        expect(await controller.getSalesReport()).toEqual({ sales: [] });
        expect(await controller.getInventoryReport()).toEqual({ inventory: [] });
    });

    it('should trigger custom administrative actions', async () => {
        expect(await controller.toggleVerifyUser('u1', true)).toEqual({ id: 'u1', isVerified: true });
        expect(await controller.createUser({ email: 'new@example.com' })).toEqual({ id: 'u2', email: 'new@example.com' });
    });
});
