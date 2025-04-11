import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Car } from '../car/car.entity';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Car, (car) => car.id)
    car: Car;

    @Column()
    start_rent_at: Date;

    @Column()
    finish_rent_at: Date;

    @Column('decimal', { nullable: true })
    total_price: number;

    @Column({ nullable: true }) // ✅ Add this
    slip_url: string;
}
