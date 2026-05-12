import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProductsService } from './products/products.service';
import { faker } from '@faker-js/faker';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const productsService = app.get(ProductsService);

    console.log('Seeding products...');
    const limit = 20;

    for (let i = 0; i < limit; i++) {
        await productsService.create({
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            category: faker.commerce.department(),
            brand: faker.company.name(),
            price: parseFloat(faker.commerce.price()),
            stock: faker.number.int({ min: 10, max: 100 }),
            images: [
                faker.image.urlPicsumPhotos(),
                faker.image.urlPicsumPhotos(),
            ],
            rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
        });
    }

    console.log('Seeding completed!');
    await app.close();
}
bootstrap();
