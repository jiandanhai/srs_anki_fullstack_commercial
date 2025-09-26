import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './entities/card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { User } from '../users/entities/user.entity';

/**
 * CardsService - 负责卡片的 CRUD 与查询逻辑
 */
@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepo: Repository<Card>,
  ) {}

  // 创建卡片，owner 是 User 实体（由 controller 提供）
  async create(owner: User, dto: CreateCardDto): Promise<Card> {
    const card = this.cardRepo.create({
      owner,
      question: dto.question,
      answer: dto.answer,
      tags: dto.tags || null,
      difficulty: dto.difficulty ?? 3,
      // SM-2 默认值
      ef: 2.5,
      repetition: 0,
      interval: 0,
      nextReviewAt: new Date(), // 新卡立即可复习（或设为 null）
    });
    return this.cardRepo.save(card);
  }

  // 根据 id 查询（包含 owner）
  async findById(id: number): Promise<Card> {
    const card = await this.cardRepo.findOne({ where: { id }, relations: ['owner'] });
    if (!card) throw new NotFoundException('Card not found');
    return card;
  }

  // 分页列出用户所有卡片
  async listByUser(userId: number, page = 1, pageSize = 20) {
    const [items, total] = await this.cardRepo.findAndCount({
      where: { owner: { id: userId } as any },
      relations: ['owner'],
      order: { updatedAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { items, total, page, pageSize };
  }

  // 更新（仅 owner 可更新）
  async update(userId: number, id: number, dto: UpdateCardDto): Promise<Card> {
    const card = await this.findById(id);
    if (card.owner.id !== userId) throw new ForbiddenException('Not allowed');
    if (dto.question !== undefined) card.question = dto.question;
    if (dto.answer !== undefined) card.answer = dto.answer;
    if (dto.tags !== undefined) card.tags = dto.tags;
    if (dto.difficulty !== undefined) card.difficulty = dto.difficulty;
    return this.cardRepo.save(card);
  }

  // 删除（仅 owner 可删除）
  async remove(userId: number, id: number): Promise<void> {
    const card = await this.findById(id);
    if (card.owner.id !== userId) throw new ForbiddenException('Not allowed');
    await this.cardRepo.remove(card);
  }

  // 查询某用户到期（或过期）的卡片，用于复习队列
  // limit: 最大卡片数，默认 50
  async findDueCards(userId: number, limit = 50): Promise<Card[]> {
    const now = new Date();
    const qb = this.cardRepo.createQueryBuilder('card')
      .leftJoinAndSelect('card.owner', 'owner')
      .where('owner.id = :userId', { userId })
      .andWhere('(card.nextReviewAt IS NULL OR card.nextReviewAt <= :now)', { now })
      .orderBy('card.nextReviewAt', 'ASC')
      .limit(limit);
    const cards = await qb.getMany();
    return cards;
  }

  // 批量更新卡片（用于 review 模块在提交后更新 ef/repetition/interval/nextReviewAt）
  async save(card: Card): Promise<Card> {
    return this.cardRepo.save(card);
  }
}
