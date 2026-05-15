import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Brand } from './entities/brand.entity';
import { Review } from './entities/review.entity';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Brand, Review])],
  controllers: [ProductsController, ReviewsController],
  providers: [ProductsService, ReviewsService],
  exports: [ProductsService, ReviewsService],
})
export class ProductsModule { }
