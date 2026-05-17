import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum DiscountType {
    PERCENTAGE = 'percentage',
    FIXED = 'fixed',
}

@Entity('coupons')
export class Coupon {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    code: string;

    @Column({
        type: 'enum',
        enum: DiscountType,
        default: DiscountType.PERCENTAGE,
    })
    discountType: DiscountType;

    @Column('decimal')
    discountValue: number;

    @Column('decimal', { default: 0 })
    minPurchase: number;

    @Column('decimal', { nullable: true })
    maxDiscount: number;

    @Column({ default: 100 })
    usageLimit: number;

    @Column({ default: 0 })
    usedCount: number;

    @Column({ nullable: true })
    expiresAt: Date;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
