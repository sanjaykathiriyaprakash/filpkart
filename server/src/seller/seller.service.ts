import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';
import { Category } from '../products/entities/category.entity';
import { Brand } from '../products/entities/brand.entity';

@Injectable()
export class SellerService {
    constructor(
        @InjectRepository(User) private usersRepo: Repository<User>,
        @InjectRepository(Product) private productsRepo: Repository<Product>,
        @InjectRepository(Order) private ordersRepo: Repository<Order>,
        @InjectRepository(Category) private categoriesRepo: Repository<Category>,
        @InjectRepository(Brand) private brandsRepo: Repository<Brand>,
    ) { }

    async getSellerStats(sellerId: string) {
        const products = await this.productsRepo.find({ where: { seller: { id: sellerId } } });
        const totalProducts = products.length;
        const totalStock = products.reduce((s, p) => s + p.stock, 0);
        const totalEarnings = products.reduce((s, p) => s + Number(p.price) * (100 - Math.min(p.stock, 100)), 0);
        
        // Since products is JSONB, we need to query differently
        const allOrders = await this.ordersRepo.find();
        const sellerOrders = allOrders.filter(order => 
            order.products && Array.isArray(order.products) && 
            order.products.some((p: any) => p.seller?.id === sellerId || p.seller === sellerId)
        );
        
        return { totalProducts, totalStock, totalEarnings, totalOrders: sellerOrders.length };
    }

    async getSellerProducts(sellerId: string) {
        return this.productsRepo.find({
            where: { seller: { id: sellerId } },
            relations: ['category', 'brand'],
            order: { createdAt: 'DESC' },
        });
    }

    async createProduct(sellerId: string, dto: any) {
        const seller = await this.usersRepo.findOne({ where: { id: sellerId } });
        if (!seller) throw new NotFoundException('Seller not found');

        // Resolve category by name (create if not exists)
        let category: Category | null = null;
        const catName = dto.category || dto.categoryName || 'General';
        if (typeof catName === 'string') {
            category = await this.categoriesRepo.findOne({ where: { name: catName } });
            if (!category) {
                category = await this.categoriesRepo.save(this.categoriesRepo.create({ name: catName }));
            }
        }

        // Resolve brand by name (create if not exists)
        let brand: Brand | null = null;
        const brandName = dto.brand || dto.brandName || catName;
        if (typeof brandName === 'string') {
            brand = await this.brandsRepo.findOne({ where: { name: brandName } });
            if (!brand) {
                brand = await this.brandsRepo.save(this.brandsRepo.create({ name: brandName }));
            }
        }

        const { category: _c, brand: _b, categoryName: _cn, brandName: _bn, ...rest } = dto;
        const product = this.productsRepo.create({
            ...rest,
            seller,
            category,
            brand,
            isApproved: false,
        });
        return this.productsRepo.save(product);
    }

    async updateProduct(sellerId: string, productId: string, dto: Partial<Product>) {
        const product = await this.productsRepo.findOne({ where: { id: productId, seller: { id: sellerId } } });
        if (!product) throw new NotFoundException('Product not found');
        await this.productsRepo.update(productId, dto);
        return this.productsRepo.findOne({ where: { id: productId }, relations: ['category', 'brand'] });
    }

    async deleteProduct(sellerId: string, productId: string) {
        const product = await this.productsRepo.findOne({ where: { id: productId, seller: { id: sellerId } } });
        if (!product) throw new NotFoundException('Product not found');
        await this.productsRepo.delete(productId);
        return { success: true };
    }

    async getSellerOrders(sellerId: string) {
        // Since products is JSONB, we need to load all orders and filter
        const allOrders = await this.ordersRepo.find({ 
            relations: ['user'],
            order: { createdAt: 'DESC' }
        });
        
        // Filter orders that contain products from this seller
        return allOrders.filter(order => 
            order.products && Array.isArray(order.products) && 
            order.products.some((p: any) => p.seller?.id === sellerId || p.seller === sellerId)
        );
    }

    async updateProfile(sellerId: string, sellerProfile: any) {
        await this.usersRepo.update(sellerId, { sellerProfile });
        return this.usersRepo.findOne({ where: { id: sellerId } });
    }

    async getAnalytics(sellerId: string) {
        const orders = await this.getSellerOrders(sellerId);
        
        const monthlySales: Record<string, number> = {};
        const topProducts: Record<string, { count: number, title: string, earnings: number }> = {};
        let totalRevenue = 0;

        for (const order of orders) {
            const date = new Date(order.createdAt);
            const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            for (const item of order.products) {
                if (item.seller?.id === sellerId || item.seller === sellerId) {
                    const price = Number(item.price);
                    const qty = item.quantity || 1;
                    const revenue = price * qty;
                    
                    monthlySales[month] = (monthlySales[month] || 0) + revenue;
                    totalRevenue += revenue;

                    if (!topProducts[item.id]) {
                        topProducts[item.id] = { count: 0, title: item.title, earnings: 0 };
                    }
                    topProducts[item.id].count += qty;
                    topProducts[item.id].earnings += revenue;
                }
            }
        }

        return {
            monthlySales: Object.keys(monthlySales).map(month => ({ month, sales: monthlySales[month] })).sort((a, b) => a.month.localeCompare(b.month)),
            topProducts: Object.values(topProducts).sort((a, b) => b.earnings - a.earnings).slice(0, 5),
            totalRevenue
        };
    }

    async getEarnings(sellerId: string) {
        const analytics = await this.getAnalytics(sellerId);
        const currentMonth = new Date().toISOString().slice(0, 7);
        const thisMonthEarnings = analytics.monthlySales.find(m => m.month === currentMonth)?.sales || 0;
        
        // Simple mock for payouts
        const payouts = analytics.monthlySales.map(m => ({
            month: m.month,
            amount: m.sales * 0.9, // Assuming 10% platform fee
            status: m.month === currentMonth ? 'Pending' : 'Paid'
        }));

        return {
            totalEarnings: analytics.totalRevenue * 0.9,
            thisMonthEarnings: thisMonthEarnings * 0.9,
            pendingPayout: thisMonthEarnings * 0.9,
            payouts
        };
    }
}
