import { Controller, Get, Post, Patch, Delete, Param, Body, Request, UseGuards } from '@nestjs/common';
import { SellerService } from './seller.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('seller')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SELLER, UserRole.ADMIN)
export class SellerController {
    constructor(private readonly sellerService: SellerService) { }

    @Get('stats')
    getStats(@Request() req: any) {
        return this.sellerService.getSellerStats(req.user.id);
    }

    @Get('products')
    getProducts(@Request() req: any) {
        return this.sellerService.getSellerProducts(req.user.id);
    }

    @Post('products')
    createProduct(@Request() req: any, @Body() dto: any) {
        return this.sellerService.createProduct(req.user.id, dto);
    }

    @Patch('products/:id')
    updateProduct(@Request() req: any, @Param('id') id: string, @Body() dto: any) {
        return this.sellerService.updateProduct(req.user.id, id, dto);
    }

    @Delete('products/:id')
    deleteProduct(@Request() req: any, @Param('id') id: string) {
        return this.sellerService.deleteProduct(req.user.id, id);
    }

    @Get('orders')
    getOrders(@Request() req: any) {
        return this.sellerService.getSellerOrders(req.user.id);
    }

    @Patch('profile')
    updateProfile(@Request() req: any, @Body() profileDto: any) {
        return this.sellerService.updateProfile(req.user.id, profileDto);
    }

    @Get('analytics')
    getAnalytics(@Request() req: any) {
        return this.sellerService.getAnalytics(req.user.id);
    }

    @Get('earnings')
    getEarnings(@Request() req: any) {
        return this.sellerService.getEarnings(req.user.id);
    }
}
