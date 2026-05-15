import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistService {
    constructor(
        @InjectRepository(Wishlist)
        private wishlistRepository: Repository<Wishlist>,
    ) { }

    async findAll(): Promise<Wishlist[]> {
        return this.wishlistRepository.find();
    }

    async add(product: any): Promise<Wishlist> {
        const item = Object.assign(new Wishlist(), { product });
        return this.wishlistRepository.save(item);
    }

    async remove(id: string): Promise<void> {
        await this.wishlistRepository.delete(id);
    }
}
