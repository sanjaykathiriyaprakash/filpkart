import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';
import { Coupon } from '../products/entities/coupon.entity';
import { Banner } from '../products/entities/banner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Order, Coupon, Banner])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
