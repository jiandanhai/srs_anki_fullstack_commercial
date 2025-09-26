"use strict";
/**
 * app.module.ts
 *
 * 根模块：
 * - 注册 ConfigModule, TypeOrmModule, UsersModule, CardsModule, ReviewModule
 * - 注册 AuthModule（提供 Google/Azure/WeChat OAuth2 支持）
 * - 在 main.ts 中启用 cookie-parser
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_module_1 = require("./config/config.module");
const users_module_1 = require("./users/users.module");
const cards_module_1 = require("./cards/cards.module");
const review_module_1 = require("./review/review.module");
const auth_module_1 = require("./auth/auth.module"); // ✅ 新增
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_module_1.ConfigModule,
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => ({
                    type: 'postgres',
                    host: process.env.DB_HOST || 'localhost',
                    port: parseInt(process.env.DB_PORT || '5432'),
                    username: process.env.DB_USER || 'postgres',
                    password: process.env.DB_PASS || 'postgres',
                    database: process.env.DB_NAME || 'srs',
                    autoLoadEntities: true,
                    synchronize: true, // ⚠️ 开发模式用，生产需改为 false
                }),
            }),
            users_module_1.UsersModule,
            cards_module_1.CardsModule,
            review_module_1.ReviewModule,
            auth_module_1.AuthModule, // ✅ 新增：接入 OAuth/SSO 登录
        ],
    })
], AppModule);
