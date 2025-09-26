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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
var typeorm_1 = require("typeorm");
var user_entity_1 = require("../../users/entities/user.entity");
/**
 * Card 实体：表示一张记忆卡片
 * 包含 SM-2 所需字段（ef、repetition、interval、nextReviewAt）
 */
var Card = function () {
    var _classDecorators = [(0, typeorm_1.Entity)({ name: 'cards' })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _question_decorators;
    var _question_initializers = [];
    var _question_extraInitializers = [];
    var _answer_decorators;
    var _answer_initializers = [];
    var _answer_extraInitializers = [];
    var _owner_decorators;
    var _owner_initializers = [];
    var _owner_extraInitializers = [];
    var _tags_decorators;
    var _tags_initializers = [];
    var _tags_extraInitializers = [];
    var _difficulty_decorators;
    var _difficulty_initializers = [];
    var _difficulty_extraInitializers = [];
    var _ef_decorators;
    var _ef_initializers = [];
    var _ef_extraInitializers = [];
    var _repetition_decorators;
    var _repetition_initializers = [];
    var _repetition_extraInitializers = [];
    var _interval_decorators;
    var _interval_initializers = [];
    var _interval_extraInitializers = [];
    var _nextReviewAt_decorators;
    var _nextReviewAt_initializers = [];
    var _nextReviewAt_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var Card = _classThis = /** @class */ (function () {
        function Card_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            // 题面
            this.question = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _question_initializers, void 0));
            // 答案（纯文本，可按需改为 JSON / 富文本）
            this.answer = (__runInitializers(this, _question_extraInitializers), __runInitializers(this, _answer_initializers, void 0));
            // 归属用户（owner）
            this.owner = (__runInitializers(this, _answer_extraInitializers), __runInitializers(this, _owner_initializers, void 0));
            // 可选标签，用逗号分隔，或单独做 tags 表（本示例简化）
            this.tags = (__runInitializers(this, _owner_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            // 难度，1-5 级（可用于筛选/统计）
            this.difficulty = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _difficulty_initializers, void 0));
            // SM-2: easiness factor (EF)，默认 2.5
            this.ef = (__runInitializers(this, _difficulty_extraInitializers), __runInitializers(this, _ef_initializers, void 0));
            // SM-2: repetition count（连续正确次数）
            this.repetition = (__runInitializers(this, _ef_extraInitializers), __runInitializers(this, _repetition_initializers, void 0));
            // SM-2: interval (days)
            this.interval = (__runInitializers(this, _repetition_extraInitializers), __runInitializers(this, _interval_initializers, void 0));
            // 下次复习时间（UTC）
            this.nextReviewAt = (__runInitializers(this, _interval_extraInitializers), __runInitializers(this, _nextReviewAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _nextReviewAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
        return Card_1;
    }());
    __setFunctionName(_classThis, "Card");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('increment')];
        _question_decorators = [(0, typeorm_1.Column)('text')];
        _answer_decorators = [(0, typeorm_1.Column)('text')];
        _owner_decorators = [(0, typeorm_1.ManyToOne)(function () { return user_entity_1.User; }, { nullable: false, onDelete: 'CASCADE' })];
        _tags_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true })];
        _difficulty_decorators = [(0, typeorm_1.Column)({ type: 'int', default: 3 })];
        _ef_decorators = [(0, typeorm_1.Column)({ type: 'float', default: 2.5 })];
        _repetition_decorators = [(0, typeorm_1.Column)({ type: 'int', default: 0 })];
        _interval_decorators = [(0, typeorm_1.Column)({ type: 'int', default: 0 })];
        _nextReviewAt_decorators = [(0, typeorm_1.Index)(), (0, typeorm_1.Column)({ type: 'timestamp with time zone', nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)({ name: 'created_at' })];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _question_decorators, { kind: "field", name: "question", static: false, private: false, access: { has: function (obj) { return "question" in obj; }, get: function (obj) { return obj.question; }, set: function (obj, value) { obj.question = value; } }, metadata: _metadata }, _question_initializers, _question_extraInitializers);
        __esDecorate(null, null, _answer_decorators, { kind: "field", name: "answer", static: false, private: false, access: { has: function (obj) { return "answer" in obj; }, get: function (obj) { return obj.answer; }, set: function (obj, value) { obj.answer = value; } }, metadata: _metadata }, _answer_initializers, _answer_extraInitializers);
        __esDecorate(null, null, _owner_decorators, { kind: "field", name: "owner", static: false, private: false, access: { has: function (obj) { return "owner" in obj; }, get: function (obj) { return obj.owner; }, set: function (obj, value) { obj.owner = value; } }, metadata: _metadata }, _owner_initializers, _owner_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: function (obj) { return "tags" in obj; }, get: function (obj) { return obj.tags; }, set: function (obj, value) { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _difficulty_decorators, { kind: "field", name: "difficulty", static: false, private: false, access: { has: function (obj) { return "difficulty" in obj; }, get: function (obj) { return obj.difficulty; }, set: function (obj, value) { obj.difficulty = value; } }, metadata: _metadata }, _difficulty_initializers, _difficulty_extraInitializers);
        __esDecorate(null, null, _ef_decorators, { kind: "field", name: "ef", static: false, private: false, access: { has: function (obj) { return "ef" in obj; }, get: function (obj) { return obj.ef; }, set: function (obj, value) { obj.ef = value; } }, metadata: _metadata }, _ef_initializers, _ef_extraInitializers);
        __esDecorate(null, null, _repetition_decorators, { kind: "field", name: "repetition", static: false, private: false, access: { has: function (obj) { return "repetition" in obj; }, get: function (obj) { return obj.repetition; }, set: function (obj, value) { obj.repetition = value; } }, metadata: _metadata }, _repetition_initializers, _repetition_extraInitializers);
        __esDecorate(null, null, _interval_decorators, { kind: "field", name: "interval", static: false, private: false, access: { has: function (obj) { return "interval" in obj; }, get: function (obj) { return obj.interval; }, set: function (obj, value) { obj.interval = value; } }, metadata: _metadata }, _interval_initializers, _interval_extraInitializers);
        __esDecorate(null, null, _nextReviewAt_decorators, { kind: "field", name: "nextReviewAt", static: false, private: false, access: { has: function (obj) { return "nextReviewAt" in obj; }, get: function (obj) { return obj.nextReviewAt; }, set: function (obj, value) { obj.nextReviewAt = value; } }, metadata: _metadata }, _nextReviewAt_initializers, _nextReviewAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Card = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Card = _classThis;
}();
exports.Card = Card;
