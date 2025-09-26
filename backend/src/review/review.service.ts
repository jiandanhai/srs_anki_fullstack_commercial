import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '../cards/entities/card.entity';
import { ReviewDto } from './dto/review.dto';
import { applySM2 } from './sm2';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepo: Repository<Card>,
  ) {}

  // 提交复习结果
  async review(userId: number, dto: ReviewDto) {
    const card = await this.cardRepo.findOne({ where: { id: dto.cardId }, relations: ['owner'] });
    if (!card) throw new NotFoundException('Card not found');
    if (card.owner.id !== userId) throw new ForbiddenException('Not your card');

    applySM2(card, dto.grade);

    await this.cardRepo.save(card);

    return {
      id: card.id,
      ef: card.ef,
      repetition: card.repetition,
      interval: card.interval,
      nextReviewAt: card.nextReviewAt,
    };
  }
}
