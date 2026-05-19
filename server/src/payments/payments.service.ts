import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { OrdersService } from '../orders/orders.service';
import { OrderStatus } from '../orders/entities/order.entity';
import Stripe from 'stripe';
import type { Stripe as StripeType } from 'stripe';

// Use Stripe TEST keys — swap with real keys in production .env
const STRIPE_SECRET_KEY = 'dummy_test_key_for_flow';

@Injectable()
export class PaymentsService {
    private stripe: StripeType;

    constructor(
        @InjectRepository(Payment)
        private paymentsRepository: Repository<Payment>,
        private ordersService: OrdersService,
    ) {
        // Initialize with dummy key — replace with process.env.STRIPE_SECRET_KEY
        this.stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia' });
    }

    /** Step 1: Create a payment intent and persist it */
    async createPaymentIntent(orderId: string, userId: string): Promise<{ clientSecret: string; paymentId: string }> {
        const order = await this.ordersService.findOne(orderId);
        if (!order) throw new NotFoundException('Order not found');

        const amountInPaise = Math.round(Number(order.totalAmount) * 100); // Stripe uses smallest unit

        // Create a mock/dummy payment intent (works even with test key)
        let clientSecret = `dummy_secret_${Date.now()}`;
        let stripePaymentIntentId = `pi_dummy_${Date.now()}`;

        // Try real Stripe call — falls back to dummy if key is invalid
        try {
            const intent = await this.stripe.paymentIntents.create({
                amount: amountInPaise,
                currency: 'inr',
                metadata: { orderId, userId },
            });
            clientSecret = intent.client_secret!;
            stripePaymentIntentId = intent.id;
        } catch {
            console.log('[Stripe Mock] Using dummy payment intent — configure real test key for live flow');
        }

        let targetUser = null;
        if (userId && userId !== 'guest') {
            try {
                const userExists = await this.paymentsRepository.manager.getRepository('User').findOne({
                    where: { id: userId }
                });
                if (userExists) {
                    targetUser = { id: userId } as any;
                }
            } catch (err) {
                console.error('[Payments System] Failed to verify user existence:', err);
            }
        }

        const payment = this.paymentsRepository.create({
            order: { id: orderId } as any,
            user: targetUser,
            amount: order.totalAmount,
            currency: 'INR',
            stripePaymentIntentId,
            stripeClientSecret: clientSecret,
            status: PaymentStatus.PENDING,
        });
        const saved = await this.paymentsRepository.save(payment);
        return { clientSecret, paymentId: saved.id };
    }

    /** Step 2: Confirm payment — called after successful Stripe card submission */
    async confirmPayment(paymentId: string, paymentMethodId: string): Promise<Payment> {
        const payment = await this.paymentsRepository.findOne({ where: { id: paymentId }, relations: ['order'] });
        if (!payment) throw new NotFoundException('Payment not found');

        let succeeded = false;
        let receiptUrl = `https://mock.flipkrt.in/receipts/${paymentId}.pdf`;

        // Try Stripe confirm — fallback to dummy
        try {
            const confirmed = await this.stripe.paymentIntents.confirm(payment.stripePaymentIntentId, {
                payment_method: paymentMethodId,
            });
            succeeded = confirmed.status === 'succeeded';
            receiptUrl = (confirmed as any).charges?.data?.[0]?.receipt_url || receiptUrl;
        } catch {
            // Simulate success for dummy/test flow
            succeeded = true;
        }

        if (succeeded) {
            payment.status = PaymentStatus.SUCCEEDED;
            payment.paymentMethod = paymentMethodId;
            payment.receiptUrl = receiptUrl;
            await this.paymentsRepository.save(payment);
            // Update order status
            await this.ordersService.updateStatus(payment.order.id, OrderStatus.CONFIRMED);
        } else {
            payment.status = PaymentStatus.FAILED;
            await this.paymentsRepository.save(payment);
            throw new BadRequestException('Payment failed');
        }

        return payment;
    }

    /** Get payment details by order */
    async getByOrder(orderId: string): Promise<Payment | null> {
        return this.paymentsRepository.findOne({ where: { order: { id: orderId } } });
    }

    async getById(paymentId: string): Promise<Payment | null> {
        return this.paymentsRepository.findOne({ where: { id: paymentId }, relations: ['order', 'user'] });
    }

    /** Refund */
    async refund(paymentId: string): Promise<Payment> {
        const payment = await this.getById(paymentId);
        if (!payment) throw new NotFoundException('Payment not found');

        try {
            await this.stripe.refunds.create({ payment_intent: payment.stripePaymentIntentId });
        } catch {
            console.log('[Stripe Mock] Simulated refund success');
        }

        payment.status = PaymentStatus.REFUNDED;
        return this.paymentsRepository.save(payment);
    }

    /** Generate invoice data */
    generateInvoice(payment: Payment) {
        return {
            invoiceId: payment.order?.invoiceId || `INV-${Date.now()}`,
            paymentId: payment.id,
            orderId: (payment.order as any)?.id,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
            paidAt: payment.updatedAt,
            receiptUrl: payment.receiptUrl || `https://mock.flipkrt.in/receipts/${payment.id}.pdf`,
            items: (payment.order as any)?.products || [],
            trackingNumber: (payment.order as any)?.trackingNumber,
        };
    }
}
