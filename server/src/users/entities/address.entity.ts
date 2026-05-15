import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('addresses')
export class Address {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
    user: User;

    @Column()
    fullName: string;

    @Column()
    mobile: string;

    @Column()
    pincode: string;

    @Column()
    state: string;

    @Column()
    city: string;

    @Column()
    streetAddress: string;

    @Column({ default: 'Home' })
    addressType: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
