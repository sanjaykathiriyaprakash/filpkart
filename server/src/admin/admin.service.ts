import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { Coupon } from '../products/entities/coupon.entity';
import { Banner } from '../products/entities/banner.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User) private usersRepo: Repository<User>,
        @InjectRepository(Product) private productsRepo: Repository<Product>,
        @InjectRepository(Order) private ordersRepo: Repository<Order>,
        @InjectRepository(Coupon) private couponsRepo: Repository<Coupon>,
        @InjectRepository(Banner) private bannersRepo: Repository<Banner>,
    ) { }

    async getDashboardStats() {
        const totalUsers = await this.usersRepo.count({ where: { role: UserRole.CUSTOMER } });
        const totalSellers = await this.usersRepo.count({ where: { role: UserRole.SELLER } });
        const totalProducts = await this.productsRepo.count();
        const pendingApproval = await this.productsRepo.count({ where: { isApproved: false } });
        const totalOrders = await this.ordersRepo.count();
        const products = await this.productsRepo.find({ select: ['price', 'stock'] });
        const totalRevenue = products.reduce((sum, p) => sum + Number(p.price) * (100 - p.stock), 0);
        return { totalUsers, totalSellers, totalProducts, pendingApproval, totalOrders, totalRevenue };
    }

    async getAllUsers() {
        return this.usersRepo.find({ select: ['id', 'name', 'email', 'role', 'isVerified', 'createdAt'] });
    }

    async getAllSellers() {
        return this.usersRepo.find({
            where: { role: UserRole.SELLER },
            select: ['id', 'name', 'email', 'sellerProfile', 'isVerified', 'createdAt'],
        });
    }

    async getPendingProducts() {
        return this.productsRepo.find({
            where: { isApproved: false },
            relations: ['category', 'brand', 'seller'],
        });
    }

    async getAllProducts() {
        return this.productsRepo.find({ relations: ['category', 'brand', 'seller'] });
    }

    async approveProduct(id: string) {
        await this.productsRepo.update(id, { isApproved: true });
        return { success: true };
    }

    async rejectProduct(id: string) {
        await this.productsRepo.delete(id);
        return { success: true };
    }

    async updateUserRole(userId: string, role: UserRole) {
        await this.usersRepo.update(userId, { role });
        return { success: true };
    }

    async getAllOrders() {
        return this.ordersRepo.find({ relations: ['user'], order: { createdAt: 'DESC' } });
    }

    // Coupons
    async getAllCoupons() {
        return this.couponsRepo.find({ order: { createdAt: 'DESC' } });
    }

    async createCoupon(dto: Partial<Coupon>) {
        const coupon = this.couponsRepo.create(dto);
        return this.couponsRepo.save(coupon);
    }

    async updateCoupon(id: string, dto: Partial<Coupon>) {
        await this.couponsRepo.update(id, dto);
        return this.couponsRepo.findOne({ where: { id } });
    }

    async deleteCoupon(id: string) {
        await this.couponsRepo.delete(id);
        return { success: true };
    }

    // Banners
    async getAllBanners() {
        return this.bannersRepo.find({ order: { sortOrder: 'ASC' } });
    }

    async createBanner(dto: Partial<Banner>) {
        const banner = this.bannersRepo.create(dto);
        return this.bannersRepo.save(banner);
    }

    async updateBanner(id: string, dto: Partial<Banner>) {
        await this.bannersRepo.update(id, dto);
        return this.bannersRepo.findOne({ where: { id } });
    }

    async deleteBanner(id: string) {
        await this.bannersRepo.delete(id);
        return { success: true };
    }

    // Reports
    async getSalesReport() {
        const orders = await this.ordersRepo.find({
            where: { orderStatus: OrderStatus.DELIVERED },
            order: { createdAt: 'ASC' }
        });

        const revenueByDate: Record<string, number> = {};
        let totalRevenue = 0;

        for (const order of orders) {
            const date = new Date(order.createdAt).toISOString().split('T')[0];
            revenueByDate[date] = (revenueByDate[date] || 0) + Number(order.totalAmount);
            totalRevenue += Number(order.totalAmount);
        }

        return {
            totalRevenue,
            totalOrders: orders.length,
            revenueByDate: Object.keys(revenueByDate).map(date => ({
                date,
                amount: revenueByDate[date]
            }))
        };
    }

    async getInventoryReport() {
        const products = await this.productsRepo.find({
            select: ['id', 'title', 'stock', 'price'],
            relations: ['seller', 'category'],
            order: { stock: 'ASC' }
        });
        
        return {
            lowStock: products.filter(p => p.stock < 10),
            outOfStock: products.filter(p => p.stock === 0),
            all: products
        };
    }

    async updateOrderStatus(id: string, status: OrderStatus) {
        await this.ordersRepo.update(id, { orderStatus: status });
        return this.ordersRepo.findOne({ where: { id } });
    }

    async toggleUserVerification(userId: string, isVerified: boolean) {
        await this.usersRepo.update(userId, { isVerified });
        return { success: true };
    }

    async createUser(dto: any) {
        const existingUser = await this.usersRepo.findOne({ where: { email: dto.email } });
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(dto.password || 'password', 10);
        const user = this.usersRepo.create({
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
            role: dto.role || UserRole.CUSTOMER,
            isVerified: dto.isVerified !== undefined ? dto.isVerified : true,
        });

        if (dto.role === UserRole.SELLER) {
            user.sellerProfile = {
                storeName: dto.storeName || `${dto.name}'s Store`,
                gstNumber: dto.gstNumber || 'GST123456789',
            } as any;
        }

        await this.usersRepo.save(user);
        const { password, ...result } = user;
        return result;
    }
}
