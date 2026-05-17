import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
    CUSTOMER = 'customer',
    ADMIN = 'admin',
    SELLER = 'seller',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password?: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CUSTOMER,
    })
    role: UserRole;

    @Column('jsonb', { nullable: true })
    addresses: any[];

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    refreshToken: string;

    @Column({ nullable: true })
    resetPasswordToken: string;

    @Column({ default: false })
    isVerified: boolean;

    @Column('jsonb', { nullable: true })
    sellerProfile: any;

    @Column({ nullable: true })
    otp: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
