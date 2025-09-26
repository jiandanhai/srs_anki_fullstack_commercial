"use strict";
/**
 * jwt-auth.guard.ts
 *
 * Guard 实现：从 Authorization header 或 HttpOnly cookie 中解析 token 并验证
 * - 优先使用 Authorization: Bearer <token>
 * - 否则尝试从 cookie (srs_token) 中读取
 *
 * 此 Guard 依赖 UsersService.verifyJwt(token)（你现有实现），并在 req.userId 写入用户 id
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../../users/users.service");
let JwtAuthGuard = class JwtAuthGuard {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        // 1) Authorization header
        const auth = req.headers?.authorization;
        let token;
        if (auth && typeof auth === 'string') {
            const parts = auth.split(' ');
            if (parts.length === 2 && parts[0] === 'Bearer')
                token = parts[1];
        }
        // 2) cookie fallback
        if (!token) {
            token = req.cookies?.srs_token || req.cookies?.jwt || req.cookies?.token;
        }
        if (!token)
            throw new common_1.UnauthorizedException('No token provided');
        try {
            const payload = this.usersService.verifyJwt(token);
            // payload.sub assumed to be user id
            req.userId = payload.sub;
            req.user = payload;
            return true;
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], JwtAuthGuard);
