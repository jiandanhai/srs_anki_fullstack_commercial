import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn, 
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

/**
 * Card 实体：表示一张记忆卡片
 * 包含 SM-2 所需字段（ef、repetition、interval、nextReviewAt）
 */
@Entity({ name: 'cards' })
export class Card {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  // 题面
  @Column('text')
  question!: string;

  // 答案（纯文本，可按需改为 JSON / 富文本）
  @Column('text')
  answer!: string;

  // 归属用户（owner）
  @ManyToOne(() => User, (u) => u.cards, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner!: User;

  // 可选标签，用逗号分隔，或单独做 tags 表（本示例简化）
  @Column({ type: 'varchar', length: 500, nullable: true })
  tags?: string | null;

  // 难度，1-5 级（可用于筛选/统计）
  @Column({ type: 'int', default: 3 })
  difficulty!: number;

  // SM-2: easiness factor (EF)，默认 2.5
  @Column({ type: 'float', default: 2.5 })
  ef!: number;

  // SM-2: repetition count（连续正确次数）
  @Column({ type: 'int', default: 0 })
  repetition!: number;

  // SM-2: interval (days)
  @Column({ type: 'int', default: 0 })
  interval!: number;

  // 下次复习时间（UTC）
  @Index()
  @Column({ name: 'next_review_at', type: 'timestamp with time zone', nullable: true })
  nextReviewAt?: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
