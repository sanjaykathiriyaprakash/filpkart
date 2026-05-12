import { User } from '../../users/entities/user.entity';
export declare class Cart {
    id: string;
    user: User;
    products: any[];
    createdAt: Date;
    updatedAt: Date;
}
