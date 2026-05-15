import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Category } from './category.entity';
import { Brand } from './brand.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
    category: Category;

    @ManyToOne(() => Brand, { nullable: true, onDelete: 'SET NULL' })
    brand: Brand;

    @Column({ unique: true, nullable: true })
    sku: string;

    @Column('jsonb', { nullable: true, default: [] })
    variants: any[];

    @Column('decimal')
    price: number;

    @Column('int', { default: 0 })
    stock: number;

    @Column('jsonb', { default: [] })
    images: string[];

    @Column('decimal', { default: 0 })
    rating: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
