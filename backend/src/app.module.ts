/**
 * app.module.ts
 *
 * 根模块：
 * - 注册 ConfigModule, TypeOrmModule, UsersModule, CardsModule, ReviewModule
 * - 注册 AuthModule（提供 Google/Azure/WeChat OAuth2 支持）
 * - 在 main.ts 中启用 cookie-parser
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { UsersModule } from './users/users.module';
import { CardsModule } from './cards/cards.module';
import { ReviewModule } from './review/review.module';
import { AuthModule } from './auth/auth.module'; // ✅ 新增

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
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
    UsersModule,
    CardsModule,
    ReviewModule,
    AuthModule, // ✅ 新增：接入 OAuth/SSO 登录
  ],
})
export class AppModule {}
