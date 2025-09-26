"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const card_entity_1 = require("../cards/entities/card.entity");
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const config_1 = require("../config/config"); // 你的 config 模块/对象（JWT_SECRET 等）
/**
 * UsersService - 整合版
 *
 * 功能：
 *  - 用户名/密码注册（createUser）
 *  - 验证用户名/密码（validateUser）
 *  - OAuth 登录入口（oauthLogin） —— 若用户不存在则自动创建
 *  - 首次登录自动初始化默认卡片（initializeCardsForUser）
 *  - JWT 生成与校验（generateJwt / verifyJwt）
 *
 * 说明：
 *  - 该服务使用 TypeORM Repository（User 和 Card）
 *  - 密码使用 bcrypt 哈希（saltRounds = 10）
 *  - JWT 使用 process.env.JWT_SECRET 或 config.JWT_SECRET
 */
let UsersService = class UsersService {
    constructor(userRepo, cardRepo) {
        this.userRepo = userRepo;
        this.cardRepo = cardRepo;
    }
    /**
     * createUser - 注册新用户（用户名/密码）
     * - 校验 username 唯一性
     * - 使用 bcrypt.hash 存储 passwordHash
     * - 注册成功后自动初始化默认卡片（提高首次体验）
     */
    async createUser(dto) {
        const existing = await this.userRepo.findOne({ where: { username: dto.username } });
        if (existing) {
            throw new common_1.ConflictException('用户名已存在');
        }
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(dto.password, saltRounds);
        const user = this.userRepo.create({
            username: dto.username,
            passwordHash,
            isActive: true,
        });
        const saved = await this.userRepo.save(user);
        // 自动初始化默认卡片（如果需要的业务逻辑）
        await this.initializeCardsForUser(saved);
        // 去掉 passwordHash 返回安全对象
        // 注意：TypeORM 返回的 saved object 包含 passwordHash 字段，这里剔除
        // 返回 Partial<User> 以避免泄露密码哈希
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash: _, ...rest } = saved;
        return rest;
    }
    /**
     * findByUsername - 根据用户名查找用户（可能为 null）
     */
    async findByUsername(username) {
        return this.userRepo.findOne({ where: { username } });
    }
    /**
     * findById - 根据 id 查找用户（包含卡片关系可按需加载）
     */
    async findById(id) {
        return this.userRepo.findOne({ where: { id } });
    }
    /**
     * validateUser - 验证用户名与密码（用于 /login）
     * - 若密码正确并且账户激活，则在首次登录时初始化卡片（若无）
     * - 返回 User 或 null
     */
    async validateUser(username, password) {
        const user = await this.findByUsername(username);
        console.log('#Found user:', user);
        if (!user)
            return null;
        if (!user.passwordHash)
            return null; // 无密码（可能为 OAuth 用户）
        const ok = await bcrypt.compare(password, user.passwordHash);
        console.log('#Password match result:', ok);
        if (!ok)
            return null;
        if (!user.isActive)
            return null;
        // 首次登录自动初始化默认卡片（如果该用户还没有卡片）
        const cardCount = await this.cardRepo.count({ where: { owner: { id: user.id } } });
        if (cardCount === 0) {
            await this.initializeCardsForUser(user);
        }
        return user;
    }
    /**
     * oauthLogin - 统一的 OAuth 登录入口
     *
     * 参数：
     *  - provider: 'wechat'|'google'|'email' 等
     *  - oauthId: 第三方返回的唯一 id（openid / sub / email 等）
     *  - email?: 可选邮箱
     *  - username?: 可选昵称（用于新建用户）
     *
     * 行为：
     *  - 若存在 (provider, oauthId) 的用户 -> 返回用户
     *  - 如果不存在 -> 创建用户（username/email 可用作默认值），并初始化卡片
     *
     * 注意：这里不执行第三方 token 验证（通常应在 OAuth 流程中由后端与第三方服务器交互并验证）
     */
    async oauthLogin(provider, oauthId, email, username) {
        // 尝试通过 provider + oauthId 查用户
        let user = await this.userRepo.findOne({ where: { oauthProvider: provider, oauthId } });
        if (!user) {
            // 若未找到，则创建新用户（首次 OAuth 登录）
            const uname = username || email || `user_${Date.now()}`;
            user = this.userRepo.create({
                username: uname,
                email: email || null,
                oauthProvider: provider,
                oauthId,
                isActive: true,
            });
            const saved = await this.userRepo.save(user);
            // 初始化默认卡片
            await this.initializeCardsForUser(saved);
            return saved;
        }
        // 若用户存在，确保首次登录时初始化卡片（若无）
        const cardCount = await this.cardRepo.count({ where: { owner: { id: user.id } } });
        if (cardCount === 0) {
            await this.initializeCardsForUser(user);
        }
        return user;
    }
    /**
     * generateJwt - 根据 user 生成 access token
     * 返回 { accessToken, expiresIn }，前端常用 access_token 字段
     */
    generateJwt(user) {
        const payload = { sub: user.id, username: user.username };
        const expiresIn = Number(process.env.JWT_EXPIRES_IN || config_1.config.JWT_EXPIRES_IN || 60 * 60 * 24); // seconds
        const secret = process.env.JWT_SECRET || config_1.config.JWT_SECRET;
        const token = jwt.sign(payload, secret, { expiresIn });
        return { accessToken: token, expiresIn };
    }
    /**
     * verifyJwt - 验证 token 并返回 payload，否则抛 UnauthorizedException
     */
    verifyJwt(token) {
        try {
            const secret = process.env.JWT_SECRET || config_1.config.JWT_SECRET;
            const payload = jwt.verify(token, secret);
            return payload;
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    /**
     * initializeCardsForUser - 私有方法：为新用户创建若干默认卡片
     * - 使用 Card Repository，关联 owner 为 user
     * - 商业项目请将默认卡片内容改为产品化的引导内容或可配置内容
     */
    async initializeCardsForUser(user) {
        // 默认卡片（示例），可根据产品需求扩展为模板、导入文件、课程等
        const defaultCards = [
            {
                question: '欢迎使用艾森复习（示例卡）',
                answer: '这是一张示例卡片，帮助你熟悉复习流程。',
            },
            {
                question: '如何开始复习？',
                answer: '打开“复习”页面，系统会自动按记忆曲线给出今日到期卡片。',
            },
            {
                question: '关于 SM-2 算法',
                answer: '系统使用 SM-2 算法（或其变体）安排复习间隔与难度。',
            },
        ];
        // 将卡片与用户 owner 关联并保存
        const cards = defaultCards.map((c) => this.cardRepo.create({
            question: c.question,
            answer: c.answer,
            owner: user,
            // 其他字段使用实体默认值（ef, repetition, interval）
        }));
        await this.cardRepo.save(cards);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_2.InjectRepository)(card_entity_1.Card)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], UsersService);
