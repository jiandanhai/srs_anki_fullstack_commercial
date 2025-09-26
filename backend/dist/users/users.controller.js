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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const login_dto_1 = require("./dto/login.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
/**
 * UsersController
 * 路由：
 *  - POST /api/users/register   -> 用户名/密码注册（返回 access_token）
 *  - POST /api/users/login      -> 用户名/密码登录（返回 access_token）
 *  - POST /api/users/oauth      -> OAuth 登录（provider + oauthId） -> 返回 access_token
 *  - GET  /api/users/me         -> 获取当前登录用户信息（受保护）
 *
 * 说明：为了与现有前端登录逻辑兼容，登录/注册接口都会直接返回 access_token 字段，
 * 前端可直接将其写入 localStorage（useStore.setToken）。
 */
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    /**
     * POST /api/users/register
     *  - 接收 CreateUserDto
     *  - 返回 { access_token, expires_in, user }
     */
    async register(dto) {
        const user = await this.usersService.createUser(dto);
        // createUser 已初始化卡片
        // 重新查询完整 user（若需要）或直接使用返回的 partial user
        const fullUser = await this.usersService.findById(user.id);
        // 生成 token
        const token = this.usersService.generateJwt(fullUser);
        return {
            access_token: token.accessToken,
            expires_in: token.expiresIn,
            user: { id: fullUser.id, username: fullUser.username },
        };
    }
    /**
     * POST /api/users/login
     *  - 接收 LoginDto
     *  - 返回 { access_token, expires_in, user }
     */
    async login(dto) {
        const user = await this.usersService.validateUser(dto.username, dto.password);
        console.log('Login attempt:', dto.username, dto.password);
        console.log('Found user:', user);
        if (!user)
            throw new common_1.BadRequestException('用户名或密码错误');
        const token = this.usersService.generateJwt(user);
        return {
            access_token: token.accessToken,
            expires_in: token.expiresIn,
            user: { id: user.id, username: user.username },
        };
    }
    /**
     * POST /api/users/oauth
     * 简化的 OAuth 登录入口（便于后端集成或开发环境模拟）
     * body: { provider: string, oauthId: string, email?: string, username?: string }
     *
     * 说明：在生产环境，你应当在后端完成 OAuth provider 的 token 校验、
     * 并使用 provider 返回的 profile 信息调用此逻辑（或直接在此方法中与 provider 交互）。
     */
    async oauthLogin(body) {
        const { provider, oauthId, email, username } = body;
        if (!provider || !oauthId) {
            throw new common_1.BadRequestException('provider 和 oauthId 为必填项');
        }
        const user = await this.usersService.oauthLogin(provider, oauthId, email, username);
        const token = this.usersService.generateJwt(user);
        return {
            access_token: token.accessToken,
            expires_in: token.expiresIn,
            user: { id: user.id, username: user.username },
        };
    }
    /**
     * GET /api/users/me
     * 受 JwtAuthGuard 保护。假定 JwtAuthGuard 会把 userId 写入 req.userId（你现有实现）
     */
    async me(req) {
        const user = await this.usersService.findById(req.userId);
        if (!user)
            throw new common_1.BadRequestException('User not found');
        // 不返回 passwordHash
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash: _, ...rest } = user;
        return { success: true, user: rest };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "register", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('oauth'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "oauthLogin", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "me", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('api/users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
