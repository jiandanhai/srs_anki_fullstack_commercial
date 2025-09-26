"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
// 简单配置常量（生产建议使用 @nestjs/config 并从 env 加载）
exports.config = {
    JWT_SECRET: process.env.JWT_SECRET || 'change_this_secret_in_prod',
    JWT_EXPIRES_IN: Number(process.env.JWT_EXPIRES_IN || 60 * 60 * 24), // seconds
};
