import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/user.entity';

export enum PaymentStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SUCCEEDED = 'SUCCEEDED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
}

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Order, { onDelete: 'CASCADE' })
    order: Order;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User;

    @Column({ nullable: true })
    stripePaymentIntentId: string;

    @Column({ nullable: true })
    stripeClientSecret: string;

    @Column('decimal')
    amount: number;

    @Column({ default: 'INR' })
    currency: string;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    })
    status: PaymentStatus;

    @Column({ nullable: true })
    paymentMethod: string;

    @Column({ nullable: true })
    receiptUrl: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
