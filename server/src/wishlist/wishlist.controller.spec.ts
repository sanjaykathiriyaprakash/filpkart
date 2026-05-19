import { Test, TestingModule } from '@nestjs/testing';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';

describe('WishlistController', () => {
    let controller: WishlistController;
    let service: WishlistService;

    const mockWishlistItem = { id: 'w1', productId: 'p1', title: 'Smartphone' };

    const mockWishlistService = {
        findAll: jest.fn(() => Promise.resolve([mockWishlistItem])),
        add: jest.fn((product: any) => Promise.resolve({ id: 'w2', ...product })),
        remove: jest.fn((id: string) => Promise.resolve({ message: 'Removed successfully' })),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WishlistController],
            providers: [
                {
                    provide: WishlistService,
                    useValue: mockWishlistService,
                },
            ],
        }).compile();

        controller = module.get<WishlistController>(WishlistController);
        service = module.get<WishlistService>(WishlistService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should fetch all wishlist items', async () => {
        const result = await controller.getWishlist();
        expect(result).toBeDefined();
        expect(result).toHaveLength(1);
        expect(mockWishlistService.findAll).toHaveBeenCalled();
    });

    it('should add an item to the wishlist', async () => {
        const dto = { productId: 'p2', title: 'Laptop' };
        const result = await controller.addToWishlist(dto);
        expect(result).toBeDefined();
        expect(result.id).toEqual('w2');
        expect(mockWishlistService.add).toHaveBeenCalledWith(dto);
    });

    it('should remove an item from the wishlist', async () => {
        const result = await controller.removeFromWishlist('w1');
        expect(result).toBeDefined();
        expect(mockWishlistService.remove).toHaveBeenCalledWith('w1');
    });

    it('should move an item to the cart', async () => {
        const result = await controller.moveToCart('w1');
        expect(result).toEqual({ message: 'Item successfully moved to cart' });
        expect(mockWishlistService.remove).toHaveBeenCalledWith('w1');
    });
});
