/**
 * main.ts
 *
 * NestJS 应用入口
 * - 全局 ValidationPipe：自动校验 & 过滤非法字段
 * - 启用 CORS：支持前端跨域请求，允许携带 cookie
 * - 启用 cookie-parser：支持 HTTP-only Cookie JWT
 * - trust proxy：生产部署时支持 https + 反向代理
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser'; // 默认导入

async function bootstrap() {
  // ✅ 创建原生 Express 实例
  const server = express();

  // ✅ 设置 trust proxy（生产环境 Nginx/反向代理）
  server.set('trust proxy', 1);

  // ✅ 创建 Nest 应用并绑定到 Express
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // ✅ 全局参数验证 & 过滤非法字段
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));


  // ✅ 允许跨域访问（带 cookie）
  app.enableCors({
    origin: (origin, callback) => {
        // 允许多个本地开发地址
        const allowedOrigins = [
        'http://localhost:5173',
        'http://127.0.0.1:5173'
        ];
        if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
    },
    credentials: true, // 允许跨域带 cookie
   });

  // ✅ 启用 cookie-parser（解析 HTTP-only Cookie）
  app.use(cookieParser());

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`🚀 Backend is running on http://localhost:${port}`);
}

bootstrap();
