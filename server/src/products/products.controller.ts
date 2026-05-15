import { Controller, Get, Param, Query, Post, Patch, Delete, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get('filter-options')
    getFilterOptions(@Query('search') search: string) {
        return this.productsService.getFilterOptions(search);
    }

    @Post('backfill-variants')
    backfillVariants() {
        return this.productsService.backfillVariants();
    }

    @Post('seed-catalog-extras')
    seedCatalogExtras() {
        return this.productsService.seedCatalogExtras();
    }

    @Get()
    findAll(
        @Query('search') search: string,
        @Query('minPrice') minPrice: number,
        @Query('maxPrice') maxPrice: number,
        @Query('minRating') minRating: number,
        @Query('sortBy') sortBy: string,
        @Query('color') color: string,
        @Query('size') size: string,
        @Query('brand') brand: string,
    ) {
        return this.productsService.findAll(search, minPrice, maxPrice, minRating, sortBy, color, size, brand);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadProductImage(@UploadedFile() file: { filename?: string } | undefined) {
        return {
            message: 'File successfully uploaded',
            url: file ? `/uploads/mock-${Date.now()}.png` : '/uploads/mock-placeholder.png',
        };
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Post()
    create(@Body() createProductDto: Record<string, unknown>) {
        return this.productsService.create(createProductDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProductDto: Record<string, unknown>) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
