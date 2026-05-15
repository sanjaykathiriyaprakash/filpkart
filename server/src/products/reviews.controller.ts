import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @Post()
    create(@Body() createReviewDto: any) {
        return this.reviewsService.create(createReviewDto);
    }

    @Get('product/:productId')
    findAllByProduct(@Param('productId') productId: string) {
        return this.reviewsService.findAllByProduct(productId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateReviewDto: any) {
        return this.reviewsService.update(id, updateReviewDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.reviewsService.remove(id);
    }
}
