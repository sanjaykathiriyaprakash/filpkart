import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    image: string;

    @ManyToOne(() => Category, category => category.subcategories, { nullable: true, onDelete: 'CASCADE' })
    parentCategory: Category;

    @OneToMany(() => Category, category => category.parentCategory)
    subcategories: Category[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
