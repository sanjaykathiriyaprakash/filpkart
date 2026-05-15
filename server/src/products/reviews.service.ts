import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private reviewsRepository: Repository<Review>,
    ) { }

    async create(createReviewDto: any): Promise<Review> {
        // In a real scenario, map this to userId implicitly via Request Auth scope.
        // For now, assume it's passed smoothly via standard params.
        const review = this.reviewsRepository.create(createReviewDto as Partial<Review>);
        return this.reviewsRepository.save(review);
    }

    async findAllByProduct(productId: string): Promise<Review[]> {
        return this.reviewsRepository.find({
            where: { product: { id: productId } },
            relations: ['user']
        });
    }

    async update(id: string, updateReviewDto: any): Promise<Review> {
        await this.reviewsRepository.update(id, updateReviewDto);
        const updated = await this.reviewsRepository.findOne({ where: { id } });
        if (!updated) throw new NotFoundException('Review not found');
        return updated;
    }

    async remove(id: string): Promise<void> {
        await this.reviewsRepository.delete(id);
    }
}
