import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { Card } from '../../cards/entities/card.entity';

/**
 * User 实体
 * - 扩展了 oauthProvider / oauthId / email 字段以支持 OAuth 登录
 * - 保留 passwordHash 以支持用户名/密码登录
 * - 添加 cards 关系以便从用户侧读取卡片（not required but convenient）
 */
@Entity({ name: 'users' })
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ length: 100 })
  username!: string;

  // bcrypt 密码哈希 — 传统登录使用
  @Column({ name: 'password_hash', nullable: true })
  passwordHash?: string;

  @Column({ name:'is_active', default: true })
  isActive!: boolean;

  // OAuth 提供者，例如 'wechat' | 'google' | 'email'
  @Column({ name: 'oauth_provider', type: 'varchar', length: 50, nullable: true })
  oauthProvider?: string | null;

  // 第三方的唯一 id（如 openid / sub / email id 等）
  @Column({ name: 'oauth_id', type: 'varchar', length: 200, nullable: true })
  oauthId?: string | null;

  // 可选邮箱字段
  @Column({name: 'email',type: 'varchar', length: 200, nullable: true })
  email?: string | null;

  // 反向关系：一个用户有多张卡片
  @OneToMany(() => Card, (card) => card.owner)
  cards?: Card[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
