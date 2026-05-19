import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Response } from 'express';

describe('PaymentsController', () => {
    let controller: PaymentsController;
    let service: PaymentsService;

    const mockPayment = { id: 'pay1', orderId: 'ord1', userId: 'u1', amount: 500, status: 'succeeded' };
    const mockInvoice = { orderId: 'ord1', total: 500, items: [] };

    const mockPaymentsService = {
        createPaymentIntent: jest.fn((orderId: string, userId: string) => Promise.resolve({ clientSecret: 'secret1', paymentId: 'pay1' })),
        confirmPayment: jest.fn((paymentId: string, paymentMethodId: string) => Promise.resolve({ status: 'succeeded' })),
        getByOrder: jest.fn((orderId: string) => Promise.resolve(mockPayment)),
        getById: jest.fn((id: string) => Promise.resolve(id === 'pay1' ? mockPayment : null)),
        generateInvoice: jest.fn((payment: any) => mockInvoice),
        refund: jest.fn((id: string) => Promise.resolve({ status: 'refunded' })),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PaymentsController],
            providers: [
                {
                    provide: PaymentsService,
                    useValue: mockPaymentsService,
                },
            ],
        }).compile();

        controller = module.get<PaymentsController>(PaymentsController);
        service = module.get<PaymentsService>(PaymentsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should create payment intent', async () => {
        const result = await controller.createPaymentIntent({ orderId: 'ord1', userId: 'u1' });
        expect(result).toBeDefined();
        expect(result.clientSecret).toEqual('secret1');
        expect(mockPaymentsService.createPaymentIntent).toHaveBeenCalledWith('ord1', 'u1');
    });

    it('should confirm payment', async () => {
        const result = await controller.confirmPayment({ paymentId: 'pay1', paymentMethodId: 'pm1' });
        expect(result).toBeDefined();
        expect(result.status).toEqual('succeeded');
        expect(mockPaymentsService.confirmPayment).toHaveBeenCalledWith('pay1', 'pm1');
    });

    it('should get payment by order ID', async () => {
        const result = await controller.getByOrder('ord1');
        expect(result).toBeDefined();
        expect(result.id).toEqual('pay1');
        expect(mockPaymentsService.getByOrder).toHaveBeenCalledWith('ord1');
    });

    it('should get payment by ID', async () => {
        const result = await controller.getById('pay1');
        expect(result).toBeDefined();
        expect(result?.id).toEqual('pay1');
        expect(mockPaymentsService.getById).toHaveBeenCalledWith('pay1');
    });

    it('should download/generate invoice successfully', async () => {
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            setHeader: jest.fn(),
        } as unknown as Response;

        await controller.downloadInvoice('pay1', res);
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.json).toHaveBeenCalledWith(mockInvoice);
    });

    it('should return 404 if payment not found for invoice', async () => {
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await controller.downloadInvoice('invalid', res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Payment not found' });
    });

    it('should refund a payment', async () => {
        const result = await controller.refund('pay1');
        expect(result).toBeDefined();
        expect(result.status).toEqual('refunded');
        expect(mockPaymentsService.refund).toHaveBeenCalledWith('pay1');
    });
});
