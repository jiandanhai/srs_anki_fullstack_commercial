"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardsService = void 0;
var common_1 = require("@nestjs/common");
/**
 * CardsService - 负责卡片的 CRUD 与查询逻辑
 */
var CardsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CardsService = _classThis = /** @class */ (function () {
        function CardsService_1(cardRepo) {
            this.cardRepo = cardRepo;
        }
        // 创建卡片，owner 是 User 实体（由 controller 提供）
        CardsService_1.prototype.create = function (owner, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var card;
                var _a;
                return __generator(this, function (_b) {
                    card = this.cardRepo.create({
                        owner: owner,
                        question: dto.question,
                        answer: dto.answer,
                        tags: dto.tags || null,
                        difficulty: (_a = dto.difficulty) !== null && _a !== void 0 ? _a : 3,
                        // SM-2 默认值
                        ef: 2.5,
                        repetition: 0,
                        interval: 0,
                        nextReviewAt: new Date(), // 新卡立即可复习（或设为 null）
                    });
                    return [2 /*return*/, this.cardRepo.save(card)];
                });
            });
        };
        // 根据 id 查询（包含 owner）
        CardsService_1.prototype.findById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var card;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.cardRepo.findOne({ where: { id: id }, relations: ['owner'] })];
                        case 1:
                            card = _a.sent();
                            if (!card)
                                throw new common_1.NotFoundException('Card not found');
                            return [2 /*return*/, card];
                    }
                });
            });
        };
        // 分页列出用户所有卡片
        CardsService_1.prototype.listByUser = function (userId_1) {
            return __awaiter(this, arguments, void 0, function (userId, page, pageSize) {
                var _a, items, total;
                if (page === void 0) { page = 1; }
                if (pageSize === void 0) { pageSize = 20; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.cardRepo.findAndCount({
                                where: { owner: { id: userId } },
                                relations: ['owner'],
                                order: { updatedAt: 'DESC' },
                                skip: (page - 1) * pageSize,
                                take: pageSize,
                            })];
                        case 1:
                            _a = _b.sent(), items = _a[0], total = _a[1];
                            return [2 /*return*/, { items: items, total: total, page: page, pageSize: pageSize }];
                    }
                });
            });
        };
        // 更新（仅 owner 可更新）
        CardsService_1.prototype.update = function (userId, id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var card;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findById(id)];
                        case 1:
                            card = _a.sent();
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
                            return [2 /*return*/, this.cardRepo.save(card)];
                    }
                });
            });
        };
        // 删除（仅 owner 可删除）
        CardsService_1.prototype.remove = function (userId, id) {
            return __awaiter(this, void 0, void 0, function () {
                var card;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findById(id)];
                        case 1:
                            card = _a.sent();
                            if (card.owner.id !== userId)
                                throw new common_1.ForbiddenException('Not allowed');
                            return [4 /*yield*/, this.cardRepo.remove(card)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        // 查询某用户到期（或过期）的卡片，用于复习队列
        // limit: 最大卡片数，默认 50
        CardsService_1.prototype.findDueCards = function (userId_1) {
            return __awaiter(this, arguments, void 0, function (userId, limit) {
                var now, qb, cards;
                if (limit === void 0) { limit = 50; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            now = new Date();
                            qb = this.cardRepo.createQueryBuilder('card')
                                .leftJoinAndSelect('card.owner', 'owner')
                                .where('owner.id = :userId', { userId: userId })
                                .andWhere('(card.nextReviewAt IS NULL OR card.nextReviewAt <= :now)', { now: now })
                                .orderBy('card.nextReviewAt', 'ASC')
                                .limit(limit);
                            return [4 /*yield*/, qb.getMany()];
                        case 1:
                            cards = _a.sent();
                            return [2 /*return*/, cards];
                    }
                });
            });
        };
        // 批量更新卡片（用于 review 模块在提交后更新 ef/repetition/interval/nextReviewAt）
        CardsService_1.prototype.save = function (card) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.cardRepo.save(card)];
                });
            });
        };
        return CardsService_1;
    }());
    __setFunctionName(_classThis, "CardsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CardsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CardsService = _classThis;
}();
exports.CardsService = CardsService;
