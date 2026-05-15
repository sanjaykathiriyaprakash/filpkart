import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { User } from '../../users/entities/user.entity';

@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Product, { onDelete: 'CASCADE' })
    product: Product;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User;

    @Column('int')
    rating: number;

    @Column('text')
    comment: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
