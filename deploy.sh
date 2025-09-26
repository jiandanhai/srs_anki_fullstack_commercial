#!/bin/bash

# ============================
# SRS Anki Fullstack 生产部署脚本
# ============================

# 设置环境
export NODE_ENV=production

# 项目路径
PROJECT_DIR=$(pwd)

echo "==============================="
echo "🔹 SRS Anki Fullstack 部署"
echo "项目路径: $PROJECT_DIR"
echo "环境: $NODE_ENV"
echo "==============================="

# 1. 拉取最新代码
echo "⏳ 拉取最新代码..."
git pull origin main || echo "Git 拉取失败，请确认已配置远程仓库"

# 2. 构建 Docker 镜像
echo "⏳ 构建 Docker 镜像..."
docker-compose build

# 3. 停止并删除旧容器
echo "⏳ 停止旧容器..."
docker-compose down

# 4. 启动容器
echo "⏳ 启动容器..."
docker-compose up -d

# 5. 输出状态
echo "==============================="
echo "✅ 部署完成!"
echo "前端访问: http://localhost:3000"
echo "后端访问: http://localhost:4000"
echo "数据库端口: 5432"
echo "==============================="

# 6. 日志提示
echo "📌 查看前端日志: docker logs -f srs_frontend"
echo "📌 查看后端日志: docker logs -f srs_backend"
