import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column()
    category: string;

    @Column()
    brand: string;

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
