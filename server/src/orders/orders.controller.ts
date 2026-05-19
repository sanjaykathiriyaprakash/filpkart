import { Controller, Post, Get, Patch, Body, Param, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderStatus } from './entities/order.entity';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    async createOrder(@Body() orderData: any) {
        return this.ordersService.create(orderData);
    }

    @Get()
    async getOrders(@Query('userId') userId?: string) {
        if (userId) {
            return this.ordersService.findByUser(userId);
        }
        return [];
    }

    @Get(':id')
    async getOrder(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }

    @Patch(':id/cancel')
    async cancelOrder(@Param('id') id: string) {
        return this.ordersService.updateStatus(id, OrderStatus.CANCELLED);
    }

    @Patch(':id/return')
    async returnOrder(@Param('id') id: string) {
        return this.ordersService.updateStatus(id, OrderStatus.RETURNED);
    }

    @Patch(':id/refund')
    async refundOrder(@Param('id') id: string) {
        return this.ordersService.updateStatus(id, OrderStatus.REFUNDED);
    }

    @Patch(':id/tracking')
    async updateTracking(@Param('id') id: string, @Body('deliveryStatus') deliveryStatus: string) {
        return this.ordersService.updateTracking(id, deliveryStatus);
    }

    @Get(':id/invoice')
    async generateInvoice(@Param('id') id: string) {
        return { url: this.ordersService.generateInvoice(id) };
    }
}
