"use strict";
/**
 * review.queue.ts
 * 简化的任务队列，用于未来扩展定时提醒/推送。
 *
 * 在生产中你可以接入 BullMQ (Redis) 或 Agenda (Mongo)。
 * 这里提供一个简化示例，模拟队列执行。
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ReviewQueue_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewQueue = void 0;
const common_1 = require("@nestjs/common");
const cards_service_1 = require("../cards/cards.service");
let ReviewQueue = ReviewQueue_1 = class ReviewQueue {
    constructor(cardsService) {
        this.cardsService = cardsService;
        this.logger = new common_1.Logger(ReviewQueue_1.name);
    }
    /**
     * 检查用户的到期卡片
     * @param userId
     */
    async checkDueCards(userId) {
        const dueCards = await this.cardsService.findDueCards(userId, 100);
        if (dueCards.length > 0) {
            this.logger.log(`User ${userId} has ${dueCards.length} cards due for review`);
        }
        else {
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
};
exports.ReviewQueue = ReviewQueue;
exports.ReviewQueue = ReviewQueue = ReviewQueue_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cards_service_1.CardsService])
], ReviewQueue);
