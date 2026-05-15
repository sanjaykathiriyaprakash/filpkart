import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProductsService } from './products/products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './products/entities/product.entity';
import { Category } from './products/entities/category.entity';
import { Brand } from './products/entities/brand.entity';
import { Repository } from 'typeorm';
import { buildVariants } from './products/variant.util';
import { CATALOG_EXTRAS } from './products/catalog-extras';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const productsService = app.get(ProductsService);
    const productsRepository = app.get<Repository<Product>>(getRepositoryToken(Product));
    const categoriesRepository = app.get<Repository<Category>>(getRepositoryToken(Category));
    const brandsRepository = app.get<Repository<Brand>>(getRepositoryToken(Brand));

    console.log('Clearing old products and relations...');
    await productsRepository.query('TRUNCATE TABLE products CASCADE');
    await categoriesRepository.query('TRUNCATE TABLE categories CASCADE');
    await brandsRepository.query('TRUNCATE TABLE brands CASCADE');

    console.log('Fetching realistic products from DummyJSON...');
    const response = await fetch('https://dummyjson.com/products?limit=150');
    const data = await response.json();

    console.log('Seeding categories, brands, and products...');

    // Cache mapped instances to prevent saving duplicates linearly constraint
    const categoriesMap = new Map<string, Category>();
    const brandsMap = new Map<string, Brand>();

    for (const item of data.products) {
        const catName = item.category || 'Generic';
        const brandName = item.brand || item.category || 'Generic';

        if (!categoriesMap.has(catName)) {
            const cat = await categoriesRepository.save(categoriesRepository.create({ name: catName }));
            categoriesMap.set(catName, cat);
        }

        if (!brandsMap.has(brandName)) {
            const br = await brandsRepository.save(brandsRepository.create({ name: brandName }));
            brandsMap.set(brandName, br);
        }

        await productsService.create({
            title: item.title,
            description: item.description,
            category: categoriesMap.get(catName),
            brand: brandsMap.get(brandName),
            price: item.price,
            stock: item.stock,
            images: item.images && item.images.length ? item.images : [item.thumbnail],
            rating: item.rating || 4.5,
            sku: item.sku || `SKU-${item.id}`,
            variants: buildVariants(catName),
        } as any);
    }

    const ensureCategory = async (name: string) => {
        if (!categoriesMap.has(name)) {
            const cat = await categoriesRepository.save(categoriesRepository.create({ name }));
            categoriesMap.set(name, cat);
        }
        return categoriesMap.get(name)!;
    };

    const ensureBrand = async (name: string) => {
        if (!brandsMap.has(name)) {
            const br = await brandsRepository.save(brandsRepository.create({ name }));
            brandsMap.set(name, br);
        }
        return brandsMap.get(name)!;
    };

    console.log('Seeding extra books & automotive catalog...');
    for (const item of CATALOG_EXTRAS) {
        await productsService.create({
            title: item.title,
            description: item.description,
            category: await ensureCategory(item.category),
            brand: await ensureBrand(item.brand),
            price: item.price,
            stock: item.stock,
            images: item.images,
            rating: item.rating,
            sku: `SKU-EXTRA-${item.title.slice(0, 8).replace(/\s/g, '')}`,
            variants: buildVariants(item.category),
        } as any);
    }

    console.log('Seeding completed!');
    await app.close();
}
bootstrap();
