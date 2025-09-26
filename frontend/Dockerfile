# =========================
# 1️⃣ 构建阶段 (仅生产模式)
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
FROM node:20-alpine AS dev
WORKDIR /app

ARG NODE_ENV

# 生产模式使用 Nginx
FROM nginx:alpine AS prod
WORKDIR /usr/share/nginx/html

# dev 模式
COPY --from=build /app /app

# 生产模式复制静态资源
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = 'production' ]; then nginx -g 'daemon off;'; else cd /app && npm run dev; fi"]
