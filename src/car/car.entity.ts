import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Car {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    category: string;

    @Column('decimal')
    price: number;

    @Column({ default: false })
    isRented: boolean;

    @Column()
    imageUrl: string;
}