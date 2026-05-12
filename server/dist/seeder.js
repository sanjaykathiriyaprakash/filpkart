"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const products_service_1 = require("./products/products.service");
const faker_1 = require("@faker-js/faker");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const productsService = app.get(products_service_1.ProductsService);
    console.log('Seeding products...');
    const limit = 20;
    for (let i = 0; i < limit; i++) {
        await productsService.create({
            title: faker_1.faker.commerce.productName(),
            description: faker_1.faker.commerce.productDescription(),
            category: faker_1.faker.commerce.department(),
            brand: faker_1.faker.company.name(),
            price: parseFloat(faker_1.faker.commerce.price()),
            stock: faker_1.faker.number.int({ min: 10, max: 100 }),
            images: [
                faker_1.faker.image.urlPicsumPhotos(),
                faker_1.faker.image.urlPicsumPhotos(),
            ],
            rating: faker_1.faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
        });
    }
    console.log('Seeding completed!');
    await app.close();
}
bootstrap();
//# sourceMappingURL=seeder.js.map