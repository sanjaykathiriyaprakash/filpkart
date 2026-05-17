import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';
import { Category } from '../products/entities/category.entity';
import { Brand } from '../products/entities/brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Order, Category, Brand])],
  controllers: [SellerController],
  providers: [SellerService],
})
export class SellerModule {}
