import { Controller, Post, Get, Param, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    /** Create Stripe PaymentIntent for an order */
    @Post('create-intent')
    createPaymentIntent(@Body() body: { orderId: string; userId: string }) {
        return this.paymentsService.createPaymentIntent(body.orderId, body.userId);
    }

    /** Confirm payment after card submission */
    @Post('confirm')
    confirmPayment(@Body() body: { paymentId: string; paymentMethodId: string }) {
        return this.paymentsService.confirmPayment(body.paymentId, body.paymentMethodId);
    }

    /** Get payment for an order */
    @Get('order/:orderId')
    getByOrder(@Param('orderId') orderId: string) {
        return this.paymentsService.getByOrder(orderId);
    }

    /** Get payment by ID */
    @Get(':id')
    getById(@Param('id') id: string) {
        return this.paymentsService.getById(id);
    }

    /** Download invoice JSON (client renders as PDF) */
    @Get(':id/invoice')
    async downloadInvoice(@Param('id') id: string, @Res() res: Response) {
        const payment = await this.paymentsService.getById(id);
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        const invoice = this.paymentsService.generateInvoice(payment);
        res.setHeader('Content-Type', 'application/json');
        res.json(invoice);
    }

    /** Refund a payment */
    @Post(':id/refund')
    refund(@Param('id') id: string) {
        return this.paymentsService.refund(id);
    }
}
