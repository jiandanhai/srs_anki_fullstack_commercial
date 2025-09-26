/**
 * review.queue.ts
 * 简化的任务队列，用于未来扩展定时提醒/推送。
 *
 * 在生产中你可以接入 BullMQ (Redis) 或 Agenda (Mongo)。
 * 这里提供一个简化示例，模拟队列执行。
 */

import { Injectable, Logger } from '@nestjs/common';
import { CardsService } from '../cards/cards.service';

@Injectable()
export class ReviewQueue {
  private readonly logger = new Logger(ReviewQueue.name);

  constructor(private readonly cardsService: CardsService) {}

  /**
   * 检查用户的到期卡片
   * @param userId
   */
  async checkDueCards(userId: number) {
    const dueCards = await this.cardsService.findDueCards(userId, 100);
    if (dueCards.length > 0) {
      this.logger.log(`User ${userId} has ${dueCards.length} cards due for review`);
    } else {
      this.logger.log(`User ${userId} has no due cards`);
    }
    return dueCards;
  }

  /**
   * 模拟周期性执行 (实际应使用 @nestjs/schedule 或外部队列)
   */
  async runCron() {
    // TODO: 获取所有用户，循环调用 checkDueCards(userId)
    this.logger.log('ReviewQueue cron executed');
  }
}
