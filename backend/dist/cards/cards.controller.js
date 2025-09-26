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
exports.CardsController = void 0;
const common_1 = require("@nestjs/common");
const cards_service_1 = require("./cards.service");
const create_card_dto_1 = require("./dto/create-card.dto");
const update_card_dto_1 = require("./dto/update-card.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const users_service_1 = require("../users/users.service");
/**
 * CardsController - 受保护路由（需要 JWT）
 * 路径： /api/cards/*
 */
let CardsController = class CardsController {
    constructor(cardsService, usersService) {
        this.cardsService = cardsService;
        this.usersService = usersService;
    }
    // 创建卡片
    async create(req, dto) {
        const userId = req.userId;
        const user = await this.usersService.findById(userId);
        return this.cardsService.create(user, dto);
    }
    // 分页获取用户卡片
    async list(req, page, pageSize) {
        const userId = req.userId;
        return this.cardsService.listByUser(userId, Number(page), Number(pageSize));
    }
    // 获取单张卡片
    async get(req, id) {
        const card = await this.cardsService.findById(id);
        // 权限校验
        if (card.owner.id !== req.userId)
            return { error: 'forbidden' };
        return card;
    }
    // 更新卡片
    async update(req, id, dto) {
        const userId = req.userId;
        return this.cardsService.update(userId, id, dto);
    }
    // 删除卡片
    async remove(req, id) {
        const userId = req.userId;
        await this.cardsService.remove(userId, id);
        return { success: true };
    }
    // 获取到期卡片（供 Review 页面调用）
    async dueList(req, limit) {
        const userId = req.userId;
        const cards = await this.cardsService.findDueCards(userId, Number(limit));
        // 返回给前端的最好剔除 owner.passwordHash 等敏感字段
        return cards.map(c => ({
            id: c.id,
            question: c.question,
            answer: c.answer,
            tags: c.tags,
            difficulty: c.difficulty,
            ef: c.ef,
            repetition: c.repetition,
            interval: c.interval,
            nextReviewAt: c.nextReviewAt,
        }));
    }
};
exports.CardsController = CardsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_card_dto_1.CreateCardDto]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1))),
    __param(2, (0, common_1.Query)('pageSize', new common_1.DefaultValuePipe(20))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "get", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_card_dto_1.UpdateCardDto]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('/due/list'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(50))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "dueList", null);
exports.CardsController = CardsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/cards'),
    __metadata("design:paramtypes", [cards_service_1.CardsService,
        users_service_1.UsersService])
], CardsController);
