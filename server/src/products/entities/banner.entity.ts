import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum BannerPosition {
    HERO = 'hero',
    SIDEBAR = 'sidebar',
    FOOTER = 'footer',
}

@Entity('banners')
export class Banner {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    imageUrl: string;

    @Column({ nullable: true })
    link: string;

    @Column({
        type: 'enum',
        enum: BannerPosition,
        default: BannerPosition.HERO,
    })
    position: BannerPosition;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: 0 })
    sortOrder: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
