import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) { }

    async create(orderData: any): Promise<Order> {
        const order = Object.assign(new Order(), orderData);
        order.trackingNumber = `TRK-${Date.now()}`;
        order.invoiceId = `INV-${Math.floor(Math.random() * 1000000)}`;

        if (order.user && order.user.id) {
            try {
                const userExists = await this.ordersRepository.manager.getRepository(User).findOne({
                    where: { id: order.user.id }
                });
                if (!userExists) {
                    order.user = null;
                }
            } catch (err) {
                console.error('[Orders System] Failed to verify user existence:', err);
                order.user = null;
            }
        } else {
            order.user = null;
        }

        return this.ordersRepository.save(order);
    }

    async findOne(id: string): Promise<Order | null> {
        return this.ordersRepository.findOne({ where: { id } });
    }

    async findByUser(userId: string): Promise<Order[]> {
        return this.ordersRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
        });
    }

    async updateStatus(id: string, status: any): Promise<Order> {
        await this.ordersRepository.update(id, { orderStatus: status });

        if (status === 'CONFIRMED') {
            const order = await this.findOne(id);
            if (order && order.products && Array.isArray(order.products)) {
                for (const item of order.products) {
                    const productId = item.product?.id || item.product?.productId || item.productId;
                    const qty = Number(item.quantity || 1);
                    if (productId) {
                        const product = await this.productsRepository.findOne({ where: { id: productId } });
                        if (product) {
                            const newStock = Math.max(0, product.stock - qty);
                            await this.productsRepository.update(product.id, { stock: newStock });
                            console.log(`[Stock System] Deducted ${qty} units of ${product.title}. Stock updated: ${product.stock} -> ${newStock}`);
                        }
                    }
                }
            }
        }

        this.sendOrderNotification(id, `Order state changed to ${status}`);
        const updated = await this.findOne(id);
        return updated!;
    }

    async updateTracking(id: string, deliveryStatus: string): Promise<Order> {
        await this.ordersRepository.update(id, { deliveryStatus });
        this.sendOrderNotification(id, `Tracking Update: ${deliveryStatus}`);
        const updated = await this.findOne(id);
        return updated!;
    }

    generateInvoice(id: string): string {
        return `https://mock.flipkrt.in/invoices/${id}.pdf`;
    }

    sendOrderNotification(id: string, message: string) {
        console.log(`[Email Mock][Order ${id}]: ${message}`);
    }
}
