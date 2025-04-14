import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Car } from '../car/car.entity';
import { User } from '../user/user.entity';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { eager: false })
    user: User;

    @ManyToOne(() => Car, (car) => car.id)
    car: Car;

    @Column()
    start_rent_at: Date;

    @Column()
    finish_rent_at: Date;

    @Column('decimal', { nullable: true })
    total_price: number;

    @Column({ nullable: true })
    slip_url: string;

    @Column({ default: false })
    status: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
