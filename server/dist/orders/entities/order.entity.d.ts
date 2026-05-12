import { User } from '../../users/entities/user.entity';
export declare enum OrderStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED"
}
export declare class Order {
    id: string;
    user: User;
    products: any[];
    totalAmount: number;
    paymentStatus: string;
    orderStatus: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
}
