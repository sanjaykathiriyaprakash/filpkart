import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    RETURNED = 'RETURNED',
    REFUNDED = 'REFUNDED',
}

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User;

    @Column('jsonb')
    products: any[];

    @Column({ nullable: true, type: 'jsonb' })
    shippingAddress: any;

    @Column('decimal')
    totalAmount: number;

    @Column({ default: 'PENDING' })
    paymentStatus: string;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    orderStatus: OrderStatus;

    @Column({ nullable: true })
    trackingNumber: string;

    @Column({ nullable: true })
    deliveryStatus: string;

    @Column({ nullable: true })
    invoiceId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
