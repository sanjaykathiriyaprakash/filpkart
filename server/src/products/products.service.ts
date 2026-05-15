import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Product } from './entities/product.entity';
import { buildVariants, normalizeVariants, collectFilterValues } from './variant.util';
import { resolveSearchProfile } from './search.config';
import { CATALOG_EXTRAS } from './catalog-extras';
import { Category } from './entities/category.entity';
import { Brand } from './entities/brand.entity';

@Injectable()
export class ProductsService {
    private variantsBackfilled = false;

    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) { }

    async create(createProductDto: DeepPartial<Product>): Promise<Product> {
        const product = this.productsRepository.create(createProductDto);
        return this.productsRepository.save(product);
    }

    async backfillVariants(): Promise<number> {
        const products = await this.productsRepository.find({ relations: ['category'] });
        let updated = 0;
        for (const p of products) {
            const catName = (p.category as { name?: string })?.name || '';
            const normalized = normalizeVariants(p.variants, catName);
            const current = JSON.stringify(p.variants || []);
            const next = JSON.stringify(normalized);
            if (current !== next) {
                await this.productsRepository.update(p.id, { variants: normalized as unknown as Product['variants'] });
                updated++;
            }
        }
        this.variantsBackfilled = true;
        return updated;
    }

    async findAll(
        search?: string,
        minPrice?: number,
        maxPrice?: number,
        minRating?: number,
        sortBy?: string,
        color?: string,
        size?: string,
        brand?: string,
    ): Promise<Product[]> {
        const query = this.productsRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.brand', 'brand');

        if (search) {
            const normalizedSearch = search.toLowerCase();
            const profile = resolveSearchProfile(normalizedSearch);

            if (profile) {
                const parts: string[] = [];
                const params: Record<string, string | string[]> = {};

                if (profile.categories?.length) {
                    parts.push('category.name IN (:...profileCats)');
                    params.profileCats = profile.categories;
                }
                if (profile.titleTerms?.length) {
                    const termParts = profile.titleTerms.map((term, i) => {
                        params[`profileTerm${i}`] = `%${term}%`;
                        return `(product.title ILIKE :profileTerm${i} OR product.description ILIKE :profileTerm${i})`;
                    });
                    parts.push(`(${termParts.join(' OR ')})`);
                }

                if (parts.length > 0) {
                    query.andWhere(`(${parts.join(' OR ')})`, params);
                } else {
                    query.andWhere('category.name ILIKE :search', { search: `%${normalizedSearch}%` });
                }

                profile.excludeTitlePatterns?.forEach((pat, i) => {
                    query.andWhere(`product.title NOT ILIKE :exclude${i}`, { [`exclude${i}`]: `%${pat}%` });
                });
            } else {
                query.andWhere(
                    '(product.title ILIKE :search OR product.description ILIKE :search OR category.name ILIKE :search OR brand.name ILIKE :search)',
                    { search: `%${normalizedSearch}%` },
                );
            }
        }

        if (minPrice != null && !Number.isNaN(Number(minPrice))) {
            query.andWhere('product.price >= :minPrice', { minPrice: Number(minPrice) });
        }
        if (maxPrice != null && !Number.isNaN(Number(maxPrice))) {
            query.andWhere('product.price <= :maxPrice', { maxPrice: Number(maxPrice) });
        }
        if (minRating != null && !Number.isNaN(Number(minRating))) {
            query.andWhere('product.rating >= :minRating', { minRating: Number(minRating) });
        }
        if (brand) {
            query.andWhere('brand.name ILIKE :brand', { brand: `%${brand}%` });
        }
        if (color) {
            query.andWhere(
                `EXISTS (
          SELECT 1 FROM jsonb_array_elements(COALESCE(product.variants, '[]'::jsonb)) v
          WHERE lower(COALESCE(v->>'type', v->>'name', '')) = 'color'
            AND EXISTS (
              SELECT 1 FROM jsonb_array_elements_text(COALESCE(v->'options', '[]'::jsonb)) opt
              WHERE lower(opt) = lower(:colorVal)
            )
        )`,
                { colorVal: color },
            );
        }
        if (size) {
            query.andWhere(
                `EXISTS (
          SELECT 1 FROM jsonb_array_elements(COALESCE(product.variants, '[]'::jsonb)) v
          WHERE lower(COALESCE(v->>'type', v->>'name', '')) IN ('size', 'storage', 'ram')
            AND EXISTS (
              SELECT 1 FROM jsonb_array_elements_text(COALESCE(v->'options', '[]'::jsonb)) opt
              WHERE lower(opt) = lower(:sizeVal)
            )
        )`,
                { sizeVal: size },
            );
        }

        if (sortBy === 'price_asc') query.orderBy('product.price', 'ASC');
        else if (sortBy === 'price_desc') query.orderBy('product.price', 'DESC');
        else if (sortBy === 'rating_desc') query.orderBy('product.rating', 'DESC');
        else query.orderBy('product.createdAt', 'DESC');

        return query.getMany();
    }

    async getFilterOptions(search?: string): Promise<{
        colors: string[];
        sizes: string[];
        brands: string[];
        priceRange: { min: number; max: number };
    }> {
        const products = await this.findAll(search);

        let colors = new Set<string>();
        let sizes = new Set<string>();
        const brands = new Set<string>();
        let minP = Infinity;
        let maxP = 0;

        for (const p of products) {
            if (p.brand && (p.brand as { name?: string }).name) {
                brands.add((p.brand as { name: string }).name);
            }
            const price = Number(p.price);
            if (!Number.isNaN(price)) {
                minP = Math.min(minP, price);
                maxP = Math.max(maxP, price);
            }
            const catName = (p.category as { name?: string })?.name || '';
            const variants = normalizeVariants(p.variants, catName);
            const { colors: c, sizes: s } = collectFilterValues(variants);
            c.forEach((x) => colors.add(x));
            s.forEach((x) => sizes.add(x));
        }

        // Auto-backfill DB once when filters are empty but products exist
        if (products.length > 0 && colors.size === 0 && !this.variantsBackfilled) {
            await this.backfillVariants();
            this.variantsBackfilled = true;
            return this.getFilterOptions(search);
        }

        // Category-aware defaults for display when still empty
        if (colors.size === 0) {
            const hint = (search || '').toLowerCase();
            const built = buildVariants(hint.includes('shirt') || hint.includes('men') ? 'mens-shirts' : hint);
            built.find((v) => v.type === 'color')?.options.forEach((c) => colors.add(c));
        }
        if (sizes.size === 0) {
            const hint = (search || '').toLowerCase();
            const built = buildVariants(hint.includes('shirt') || hint.includes('men') ? 'mens-shirts' : hint);
            built
                .filter((v) => v.type !== 'color')
                .forEach((v) => v.options.forEach((s) => sizes.add(s)));
        }

        return {
            colors: [...colors].sort(),
            sizes: [...sizes].sort(),
            brands: [...brands].sort(),
            priceRange: {
                min: minP === Infinity ? 0 : minP,
                max: maxP || 500,
            },
        };
    }

    async findOne(id: string): Promise<Product | null> {
        const product = await this.productsRepository.findOne({
            where: { id },
            relations: ['category', 'brand'],
        });
        if (!product) return null;

        const catName = (product.category as { name?: string })?.name || '';
        const normalized = normalizeVariants(product.variants, catName);
        if (JSON.stringify(product.variants || []) !== JSON.stringify(normalized)) {
            product.variants = normalized as unknown as Product['variants'];
            await this.productsRepository.update(id, { variants: product.variants });
        }
        return product;
    }

    async update(id: string, updateProductDto: Partial<Product>): Promise<Product> {
        await this.productsRepository.update(id, updateProductDto);
        const updated = await this.findOne(id);
        return updated!;
    }

    async remove(id: string): Promise<void> {
        await this.productsRepository.delete(id);
    }

    async seedCatalogExtras(): Promise<{ inserted: number; skipped: number }> {
        const catRepo = this.productsRepository.manager.getRepository(Category);
        const brandRepo = this.productsRepository.manager.getRepository(Brand);
        let inserted = 0;
        let skipped = 0;

        for (const item of CATALOG_EXTRAS) {
            const exists = await this.productsRepository
                .createQueryBuilder('product')
                .where('product.title = :title', { title: item.title })
                .getOne();
            if (exists) {
                skipped++;
                continue;
            }

            let category = await catRepo.findOne({ where: { name: item.category } });
            if (!category) category = await catRepo.save(catRepo.create({ name: item.category }));

            let brand = await brandRepo.findOne({ where: { name: item.brand } });
            if (!brand) brand = await brandRepo.save(brandRepo.create({ name: item.brand }));

            await this.create({
                title: item.title,
                description: item.description,
                category,
                brand,
                price: item.price,
                stock: item.stock,
                images: item.images,
                rating: item.rating,
                sku: `SKU-EXTRA-${Date.now()}-${inserted}`,
                variants: buildVariants(item.category),
            } as DeepPartial<Product>);
            inserted++;
        }

        return { inserted, skipped };
    }
}
