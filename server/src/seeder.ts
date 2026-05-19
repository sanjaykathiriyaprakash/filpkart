import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProductsService } from './products/products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './products/entities/product.entity';
import { Category } from './products/entities/category.entity';
import { Brand } from './products/entities/brand.entity';
import { User, UserRole } from './users/entities/user.entity';
import { Repository } from 'typeorm';
import { buildVariants } from './products/variant.util';
import { CATALOG_EXTRAS } from './products/catalog-extras';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const productsService = app.get(ProductsService);
    const productsRepository = app.get<Repository<Product>>(getRepositoryToken(Product));
    const categoriesRepository = app.get<Repository<Category>>(getRepositoryToken(Category));
    const brandsRepository = app.get<Repository<Brand>>(getRepositoryToken(Brand));
    const usersRepository = app.get<Repository<User>>(getRepositoryToken(User));

    console.log('Clearing old data...');
    await productsRepository.query('TRUNCATE TABLE products CASCADE');
    await categoriesRepository.query('TRUNCATE TABLE categories CASCADE');
    await brandsRepository.query('TRUNCATE TABLE brands CASCADE');
    await usersRepository.query('TRUNCATE TABLE users CASCADE');

    console.log('Creating Admin and Seller...');
    const hashedPassword = await bcrypt.hash('password', 10);
    await usersRepository.save(usersRepository.create({
        name: 'Admin User',
        email: 'admin@flipkart.com',
        password: hashedPassword,
        role: UserRole.ADMIN,
        isVerified: true,
    }));

    const defaultSeller = await usersRepository.save(usersRepository.create({
        name: 'Super Seller',
        email: 'seller@flipkart.com',
        password: hashedPassword,
        role: UserRole.SELLER,
        isVerified: true,
        sellerProfile: { storeName: 'Super Store', gstNumber: 'GST123456789' }
    }));

    console.log('Fetching realistic products from DummyJSON...');
    const response = await fetch('https://dummyjson.com/products?limit=0');
    const data = await response.json();

    console.log('Seeding categories, brands, and products...');

    // Cache mapped instances to prevent saving duplicates linearly constraint
    const categoriesMap = new Map<string, Category>();
    const brandsMap = new Map<string, Brand>();

    const generateAttributes = (category: string) => {
        const cat = category.toLowerCase();
        const attrs: Record<string, string> = {};
        if (cat.includes('smartphones') || cat.includes('laptops')) {
            attrs['RAM'] = ['4GB', '8GB', '16GB'][Math.floor(Math.random() * 3)];
            attrs['Processor'] = ['Snapdragon', 'Apple Silicon', 'Intel Core'][Math.floor(Math.random() * 3)];
        } else if (cat.includes('womens-dresses') || cat.includes('tops') || cat.includes('mens-shirts')) {
            attrs['Fabric'] = ['Cotton', 'Silk', 'Polyester'][Math.floor(Math.random() * 3)];
            attrs['Occasion'] = ['Casual', 'Formal', 'Party'][Math.floor(Math.random() * 3)];
            attrs['Pattern'] = ['Solid', 'Printed', 'Striped'][Math.floor(Math.random() * 3)];
        }
        return attrs;
    };

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
            seller: defaultSeller,
            price: item.price,
            stock: item.stock,
            images: item.images && item.images.length ? item.images : [item.thumbnail],
            rating: item.rating || 4.5,
            sku: item.sku || `SKU-${item.id}`,
            variants: buildVariants(catName, item.title),
            attributes: generateAttributes(catName),
            isApproved: true,
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
    let extraIndex = 0;
    for (const item of CATALOG_EXTRAS) {
        extraIndex++;
        await productsService.create({
            title: item.title,
            description: item.description,
            category: await ensureCategory(item.category),
            brand: await ensureBrand(item.brand),
            seller: defaultSeller,
            price: item.price,
            stock: item.stock,
            images: item.images,
            rating: item.rating,
            sku: `SKU-EXTRA-${extraIndex}-${item.title.slice(0, 5).replace(/\s/g, '')}`,
            variants: buildVariants(item.category, item.title),
            attributes: item.attributes || generateAttributes(item.category),
            isApproved: true,
        } as any);
    }

    console.log('Seeding completed!');
    await app.close();
}
bootstrap();
