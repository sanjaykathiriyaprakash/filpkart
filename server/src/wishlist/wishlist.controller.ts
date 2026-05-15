import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
export class WishlistController {
    constructor(private readonly wishlistService: WishlistService) { }

    @Get()
    getWishlist() {
        return this.wishlistService.findAll();
    }

    @Post()
    addToWishlist(@Body() product: any) {
        return this.wishlistService.add(product);
    }

    @Delete(':id')
    removeFromWishlist(@Param('id') id: string) {
        return this.wishlistService.remove(id);
    }

    @Post(':id/move-to-cart')
    moveToCart(@Param('id') id: string) {
        // Trigger simulated transfer sequence routing back client constraints natively
        this.wishlistService.remove(id);
        return { message: 'Item successfully moved to cart' };
    }
}
