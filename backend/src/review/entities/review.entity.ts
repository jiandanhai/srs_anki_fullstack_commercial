import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Card } from '../../cards/entities/card.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ManyToOne(() => Card, { onDelete: 'CASCADE' })
  card!: Card;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;

  @Column({ type: 'int' })
  rating!: number; // 0-5

  @CreateDateColumn({ name: 'reviewed_at' })
  reviewedAt!: Date;
}
