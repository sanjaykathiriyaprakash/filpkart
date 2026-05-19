import { Test, TestingModule } from '@nestjs/testing';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ExecutionContext } from '@nestjs/common';

describe('SellerController', () => {
    let controller: SellerController;
    let service: SellerService;

    const mockStats = { sales: 50000, itemsCount: 12 };
    const mockProducts = [{ id: 'p1', title: 'Product 1', sellerId: 's1' }];
    const mockOrders = [{ id: 'o1', amount: 1500, sellerId: 's1' }];
    const mockProfile = { id: 's1', storeName: 'ElectroStore' };

    const mockSellerService = {
        getSellerStats: jest.fn((id: string) => Promise.resolve(mockStats)),
        getSellerProducts: jest.fn((id: string) => Promise.resolve(mockProducts)),
        createProduct: jest.fn((sellerId: string, dto: any) => Promise.resolve({ id: 'p2', ...dto, sellerId })),
        updateProduct: jest.fn((sellerId: string, id: string, dto: any) => Promise.resolve({ id, ...dto, sellerId })),
        deleteProduct: jest.fn((sellerId: string, id: string) => Promise.resolve({ message: 'Deleted successfully' })),
        getSellerOrders: jest.fn((id: string) => Promise.resolve(mockOrders)),
        updateProfile: jest.fn((id: string, dto: any) => Promise.resolve({ id, ...dto })),
        getAnalytics: jest.fn((id: string) => Promise.resolve({ charts: [] })),
        getEarnings: jest.fn((id: string) => Promise.resolve({ balance: 45000 })),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SellerController],
            providers: [
                {
                    provide: SellerService,
                    useValue: mockSellerService,
                },
            ],
        })
        .overrideGuard(JwtAuthGuard)
        .useValue({ canActivate: (context: ExecutionContext) => true })
        .overrideGuard(RolesGuard)
        .useValue({ canActivate: (context: ExecutionContext) => true })
        .compile();

        controller = module.get<SellerController>(SellerController);
        service = module.get<SellerService>(SellerService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should fetch seller dashboards stats', async () => {
        const req = { user: { id: 's1' } };
        const result = await controller.getStats(req);
        expect(result).toEqual(mockStats);
        expect(mockSellerService.getSellerStats).toHaveBeenCalledWith('s1');
    });

    it('should fetch list of active seller products', async () => {
        const req = { user: { id: 's1' } };
        const result = await controller.getProducts(req);
        expect(result).toEqual(mockProducts);
        expect(mockSellerService.getSellerProducts).toHaveBeenCalledWith('s1');
    });

    it('should handle product CRUD operations for a seller', async () => {
        const req = { user: { id: 's1' } };
        const newProduct = { title: 'Smartphone X', price: 25000 };

        // Create
        expect(await controller.createProduct(req, newProduct)).toEqual({ id: 'p2', ...newProduct, sellerId: 's1' });
        expect(mockSellerService.createProduct).toHaveBeenCalledWith('s1', newProduct);

        // Update
        expect(await controller.updateProduct(req, 'p2', { price: 24000 })).toEqual({ id: 'p2', price: 24000, sellerId: 's1' });
        expect(mockSellerService.updateProduct).toHaveBeenCalledWith('s1', 'p2', { price: 24000 });

        // Delete
        expect(await controller.deleteProduct(req, 'p2')).toEqual({ message: 'Deleted successfully' });
        expect(mockSellerService.deleteProduct).toHaveBeenCalledWith('s1', 'p2');
    });

    it('should fetch seller orders', async () => {
        const req = { user: { id: 's1' } };
        expect(await controller.getOrders(req)).toEqual(mockOrders);
        expect(mockSellerService.getSellerOrders).toHaveBeenCalledWith('s1');
    });

    it('should update seller profile card info', async () => {
        const req = { user: { id: 's1' } };
        const editProfile = { storeName: 'Grand Electro' };
        expect(await controller.updateProfile(req, editProfile)).toEqual({ id: 's1', ...editProfile });
        expect(mockSellerService.updateProfile).toHaveBeenCalledWith('s1', editProfile);
    });

    it('should retrieve merchant sales analytics & earnings records', async () => {
        const req = { user: { id: 's1' } };
        expect(await controller.getAnalytics(req)).toEqual({ charts: [] });
        expect(await controller.getEarnings(req)).toEqual({ balance: 45000 });
    });
});
