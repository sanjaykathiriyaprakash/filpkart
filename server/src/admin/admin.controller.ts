import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('stats')
    getStats() {
        return this.adminService.getDashboardStats();
    }

    @Get('users')
    getAllUsers() {
        return this.adminService.getAllUsers();
    }

    @Get('sellers')
    getAllSellers() {
        return this.adminService.getAllSellers();
    }

    @Get('products')
    getAllProducts() {
        return this.adminService.getAllProducts();
    }

    @Get('products/pending')
    getPendingProducts() {
        return this.adminService.getPendingProducts();
    }

    @Patch('products/:id/approve')
    approveProduct(@Param('id') id: string) {
        return this.adminService.approveProduct(id);
    }

    @Delete('products/:id')
    rejectProduct(@Param('id') id: string) {
        return this.adminService.rejectProduct(id);
    }

    @Patch('users/:id/role')
    updateRole(@Param('id') id: string, @Body('role') role: UserRole) {
        return this.adminService.updateUserRole(id, role);
    }

    @Get('orders')
    getAllOrders() {
        return this.adminService.getAllOrders();
    }

    @Patch('orders/:id/status')
    updateOrderStatus(@Param('id') id: string, @Body('status') status: any) {
        return this.adminService.updateOrderStatus(id, status);
    }

    @Get('coupons')
    getCoupons() {
        return this.adminService.getAllCoupons();
    }

    @Post('coupons')
    createCoupon(@Body() dto: any) {
        return this.adminService.createCoupon(dto);
    }

    @Patch('coupons/:id')
    updateCoupon(@Param('id') id: string, @Body() dto: any) {
        return this.adminService.updateCoupon(id, dto);
    }

    @Delete('coupons/:id')
    deleteCoupon(@Param('id') id: string) {
        return this.adminService.deleteCoupon(id);
    }

    @Get('banners')
    getBanners() {
        return this.adminService.getAllBanners();
    }

    @Post('banners')
    createBanner(@Body() dto: any) {
        return this.adminService.createBanner(dto);
    }

    @Patch('banners/:id')
    updateBanner(@Param('id') id: string, @Body() dto: any) {
        return this.adminService.updateBanner(id, dto);
    }

    @Delete('banners/:id')
    deleteBanner(@Param('id') id: string) {
        return this.adminService.deleteBanner(id);
    }

    @Get('reports/sales')
    getSalesReport() {
        return this.adminService.getSalesReport();
    }

    @Get('reports/inventory')
    getInventoryReport() {
        return this.adminService.getInventoryReport();
    }

    @Patch('users/:id/verify')
    toggleVerifyUser(@Param('id') id: string, @Body('isVerified') isVerified: boolean) {
        return this.adminService.toggleUserVerification(id, isVerified);
    }

    @Post('users')
    createUser(@Body() dto: any) {
        return this.adminService.createUser(dto);
    }
}
