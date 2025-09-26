# 📚 SRS Anki Fullstack Commercial

基于 **艾宾浩斯遗忘曲线 / Anki (SM-2 算法)** 的全栈复习记忆应用，支持商业级部署。

---

## 🚀 技术栈

- **后端**: NestJS + TypeORM + PostgreSQL
- **前端**: React + Vite + TypeScript + Zustand
- **数据库**: PostgreSQL
- **容器编排**: Docker Compose
- **容器镜像**: 多阶段构建，支持 dev / prod 模式

---

## ⚙️ 环境变量 (.env)

```env
# 环境模式: development / production
NODE_ENV=development

# Backend
BACKEND_PORT=4000

# Frontend
FRONTEND_PORT=3000

# Database
DB_USER=postgres
DB_PASS=postgres
DB_NAME=srs_db
DB_PORT=5432

## 🏗️ 项目结构
srs_anki_fullstack_commercial/
├── backend/
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── common/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── filters/
│   │   │   └── utils/
│   │   ├── config/
│   │   │   └── config.module.ts
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── entities/user.entity.ts
│   │   ├── cards/
│   │   │   ├── cards.module.ts
│   │   │   ├── cards.controller.ts
│   │   │   ├── cards.service.ts
│   │   │   └── entities/card.entity.ts
│   │   ├── review/
│   │   │   ├── review.module.ts
│   │   │   ├── review.controller.ts
│   │   │   ├── review.service.ts
│   │   │   └── sm2.ts
│   │   └── tasks/
│   │       └── review.queue.ts
│   ├── test/
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── CardManagementPage.tsx
│   │   │   └── ReviewPage.tsx
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── CardForm.tsx
│   │   │   └── ReviewCard.tsx
│   │   └── store/
│   │       └── useStore.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md

## ⚡ 一键启动（开发 / 生产）
1️⃣ 克隆项目
git clone https://github.com/jiandanhai/srs_anki_fullstack_commercial.git
cd srs_anki_fullstack_commercial
2️⃣ 配置环境变量
cp .env.example .env
# 修改端口、数据库账号密码，设置 NODE_ENV=production
3️⃣ 启动服务
docker-compose up --build -d
开发模式 (NODE_ENV=development)
    后端：npm run start:dev
    前端：Vite 开发服务器（3000端口）
生产模式 (NODE_ENV=production)
    前端：Nginx 服务静态文件
    后端：Node 运行 dist/main.js
## 🔗 访问地址
| 服务     | 地址                                             |
| ------ | ---------------------------------------------- |
| 前端     | [http://localhost:3000](http://localhost:3000) |
| 后端 API | [http://localhost:4000](http://localhost:4000) |
| 数据库    | localhost:5432                                 |
## 🛠️ 部署准备
服务器: Linux (Ubuntu 22.04/CentOS 8)
CPU / 内存: ≥2核，≥4GB
Docker + Docker Compose
Git
可选：Nginx / Traefik 做前端反向代理
可选：PM2 管理 Node 后端进程
## 📦 商业级生产部署拓扑图
                     ┌──────────────────────────┐
                     │        用户浏览器        │
                     │  (访问域名或公网 IP)     │
                     └───────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │        Nginx 前端        │
                    │  - 服务静态文件 (dist/) │
                    │  - HTTPS / TLS 支持      │
                    │  - gzip 压缩、缓存      │
                    └───────────┬─────────────┘
                                │
          ┌─────────────────────┴─────────────────────┐
          │                                           │
          ▼                                           ▼
┌──────────────────────────┐                 ┌──────────────────────────┐
│       Node 后端容器      │                 │       PostgreSQL 容器    │
│  - NestJS + dist/main.js │ <────────────>  │  - 数据持久化 pgdata 卷 │
│  - API 接口服务          │                 │  - 生产环境账号/密码     │
│  - 日志管理 (PM2 可选)  │                 │                          │
└──────────────────────────┘                 └──────────────────────────┘
## 📝 部署流程总结
安装 Docker + Docker Compose + Git
拉取项目代码，配置 .env
构建 Docker 镜像
启动容器 docker-compose up -d --build
可选：Nginx 配置 HTTPS，PM2 管理 Node
## 🔹 一键部署脚本 deploy.sh
#!/bin/bash
export NODE_ENV=production
PROJECT_DIR=$(pwd)

echo "==============================="
echo "🔹 SRS Anki Fullstack 部署"
echo "项目路径: $PROJECT_DIR"
echo "环境: $NODE_ENV"
echo "==============================="

git pull origin main || echo "Git 拉取失败，请确认已配置远程仓库"
docker-compose build
docker-compose down
docker-compose up -d

echo "==============================="
echo "✅ 部署完成!"
echo "前端访问: http://localhost:3000"
echo "后端访问: http://localhost:4000"
echo "数据库端口: 5432"
echo "==============================="
echo "📌 查看前端日志: docker logs -f srs_frontend"
echo "📌 查看后端日志: docker logs -f srs_backend"
## ✅ 功能
用户注册 / 登录
卡片管理（增删改查）
基于 SM-2 算法的复习调度
学习进度大盘
Docker 一键部署（支持 dev / prod）:
    ---
    # 📥 下载方法（在本地生成 README.md）
    1. 在项目根目录执行：
    ```bash
    cat << 'EOF' > README.md
    #（将上面 README.md 内容复制到 EOF 与 EOF 之间）
    EOF
文件生成完成后：
    ls -l README.md


