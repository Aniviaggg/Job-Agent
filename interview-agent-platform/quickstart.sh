#!/bin/bash

# 面试准备 Agent 平台 - 快速启动脚本
# 用法: bash quickstart.sh

set -e

echo "================================"
echo "面试准备 Agent 平台 - 快速启动"
echo "================================"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装"
    echo "请先安装 Node.js (v16 或更高版本)"
    exit 1
fi

echo "✅ Node.js $(node --version) 已安装"
echo "✅ npm $(npm --version) 已安装"
echo ""

# 检查 .env 文件
if [ ! -f .env ]; then
    echo "📝 创建 .env 文件..."
    cp .env.example .env
    echo "✅ .env 文件已创建"
    echo ""
    echo "⚠️  请编辑 .env 文件并配置："
    echo "   - MONGODB_URI: MongoDB 连接字符串"
    echo "   - OPENAI_API_KEY: OpenAI API 密钥"
    exit 1
fi

echo "✅ .env 文件已存在"
echo ""

# 安装依赖
echo "📦 检查依赖..."

if [ ! -d "server/node_modules" ]; then
    echo "📦 安装后端依赖..."
    cd server
    npm install
    cd ..
    echo "✅ 后端依赖已安装"
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 安装前端依赖..."
    cd client
    npm install --legacy-peer-deps
    cd ..
    echo "✅ 前端依赖已安装"
fi

echo ""
echo "================================"
echo "✅ 准备就绪！"
echo "================================"
echo ""
echo "启动开发服务器，请运行："
echo ""
echo "  npm run dev"
echo ""
echo "然后访问："
echo "  🌐 前端: http://localhost:3000"
echo "  🔌 后端: http://localhost:5000"
echo ""
echo "更多信息请查看 README.md 和 TESTING.md"
echo ""
