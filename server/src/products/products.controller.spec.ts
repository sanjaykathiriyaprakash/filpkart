import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
    let controller: ProductsController;
    let service: ProductsService;

    const mockProducts = [
        { id: '1', title: 'Smartphone', category: 'smartphones', price: 500 },
        { id: '2', title: 'Laptop', category: 'laptops', price: 1000 },
    ];

    const mockProductsService = {
        findAll: jest.fn((search?: string) => {
            if (search) {
                return mockProducts.filter(p =>
                    p.title.includes(search) || p.category.includes(search)
                );
            }
            return mockProducts;
        }),
        findOne: jest.fn((id: string) => mockProducts.find(p => p.id === id)),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductsController],
            providers: [
                {
                    provide: ProductsService,
                    useValue: mockProductsService,
                },
            ],
        }).compile();

        controller = module.get<ProductsController>(ProductsController);
        service = module.get<ProductsService>(ProductsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should retrieve all products when no search is provided', async () => {
        const result = await controller.findAll('', undefined as any, undefined as any, undefined as any, undefined as any);
        expect(result).toHaveLength(2);
        expect(mockProductsService.findAll).toHaveBeenCalledWith('', undefined, undefined, undefined, undefined);
    });

    it('should retrieve filtered products when a search is provided', async () => {
        const result = await controller.findAll('Smartphone', undefined as any, undefined as any, undefined as any, undefined as any);
        expect(result).toHaveLength(1);
        expect(result[0].title).toEqual('Smartphone');
    });

    it('should return a single product given an ID', async () => {
        const result = await controller.findOne('2');
        expect(result).toBeDefined();
        if (result) {
            expect(result.title).toEqual('Laptop');
        }
    });
});
