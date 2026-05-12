export declare enum UserRole {
    CUSTOMER = "customer",
    ADMIN = "admin",
    SELLER = "seller"
}
export declare class User {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    addresses: any[];
    phone: string;
    createdAt: Date;
    updatedAt: Date;
}
