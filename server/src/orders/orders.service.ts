import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
    ) { }

    async create(orderData: any): Promise<Order> {
        const order = Object.assign(new Order(), orderData);
        order.trackingNumber = `TRK-${Date.now()}`;
        order.invoiceId = `INV-${Math.floor(Math.random() * 1000000)}`;
        return this.ordersRepository.save(order);
    }

    async findOne(id: string): Promise<Order | null> {
        return this.ordersRepository.findOne({ where: { id } });
    }

    async updateStatus(id: string, status: any): Promise<Order> {
        await this.ordersRepository.update(id, { orderStatus: status });
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
