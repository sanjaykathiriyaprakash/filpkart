import { Repository, DeepPartial } from 'typeorm';
import { Product } from './entities/product.entity';
export declare class ProductsService {
    private productsRepository;
    constructor(productsRepository: Repository<Product>);
    create(createProductDto: DeepPartial<Product>): Promise<Product>;
    findAll(): Promise<Product[]>;
    findOne(id: string): Promise<Product | null>;
}
