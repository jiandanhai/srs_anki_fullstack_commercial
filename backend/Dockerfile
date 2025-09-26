# =========================
# 1️⃣ 构建阶段 (仅用于生产模式)
# =========================
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# =========================
# 2️⃣ 最终镜像
# =========================
FROM node:20-alpine
WORKDIR /app

# 复制 package.json 用于 dev 安装依赖
COPY package*.json ./

# 安装生产依赖（prod）或者全部依赖（dev）
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "production" ]; then \
        npm install --only=production --legacy-peer-deps; \
    else \
        npm install --legacy-peer-deps; \
    fi

# 生产模式复制编译后的 dist
COPY --from=build /app/dist ./dist
COPY . .

EXPOSE 4000

# 根据环境运行不同命令
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = 'production' ]; then node dist/main.js; else npm run start:dev; fi"]
