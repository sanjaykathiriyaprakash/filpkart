import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

describe('OrdersController', () => {
    let controller: OrdersController;
    let service: OrdersService;

    const mockOrderService = {
        create: jest.fn((dto) => {
            return {
                id: '123-abc',
                ...dto,
            };
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [OrdersController],
            providers: [
                {
                    provide: OrdersService,
                    useValue: mockOrderService,
                },
            ],
        }).compile();

        controller = module.get<OrdersController>(OrdersController);
        service = module.get<OrdersService>(OrdersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should create an order', async () => {
        const orderData = {
            totalAmount: 1500,
            products: [{ id: '1', title: 'Laptop', price: 1500 }]
        };
        const result = await controller.createOrder(orderData);

        expect(result).toBeDefined();
        expect(result.id).toEqual('123-abc');
        expect(result.totalAmount).toEqual(1500);
        expect(mockOrderService.create).toHaveBeenCalledWith(orderData);
    });
});
