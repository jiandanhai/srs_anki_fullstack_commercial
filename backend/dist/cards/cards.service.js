"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const card_entity_1 = require("./entities/card.entity");
/**
 * CardsService - 负责卡片的 CRUD 与查询逻辑
 */
let CardsService = class CardsService {
    constructor(cardRepo) {
        this.cardRepo = cardRepo;
    }
    // 创建卡片，owner 是 User 实体（由 controller 提供）
    async create(owner, dto) {
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
    async findById(id) {
        const card = await this.cardRepo.findOne({ where: { id }, relations: ['owner'] });
        if (!card)
            throw new common_1.NotFoundException('Card not found');
        return card;
    }
    // 分页列出用户所有卡片
    async listByUser(userId, page = 1, pageSize = 20) {
        const [items, total] = await this.cardRepo.findAndCount({
            where: { owner: { id: userId } },
            relations: ['owner'],
            order: { updatedAt: 'DESC' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        return { items, total, page, pageSize };
    }
    // 更新（仅 owner 可更新）
    async update(userId, id, dto) {
        const card = await this.findById(id);
        if (card.owner.id !== userId)
            throw new common_1.ForbiddenException('Not allowed');
        if (dto.question !== undefined)
            card.question = dto.question;
        if (dto.answer !== undefined)
            card.answer = dto.answer;
        if (dto.tags !== undefined)
            card.tags = dto.tags;
        if (dto.difficulty !== undefined)
            card.difficulty = dto.difficulty;
        return this.cardRepo.save(card);
    }
    // 删除（仅 owner 可删除）
    async remove(userId, id) {
        const card = await this.findById(id);
        if (card.owner.id !== userId)
            throw new common_1.ForbiddenException('Not allowed');
        await this.cardRepo.remove(card);
    }
    // 查询某用户到期（或过期）的卡片，用于复习队列
    // limit: 最大卡片数，默认 50
    async findDueCards(userId, limit = 50) {
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
    async save(card) {
        return this.cardRepo.save(card);
    }
};
exports.CardsService = CardsService;
exports.CardsService = CardsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(card_entity_1.Card)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CardsService);
