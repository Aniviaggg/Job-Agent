#!/bin/bash

echo "🚀 启动面试准备平台..."
echo ""

# 启动后端
echo "📦 启动后端服务器 (http://localhost:5000)..."
cd /Users/rg125/llm_study/interview-agent-platform/server
node ./dist/server.js &
BACKEND_PID=$!

# 等待后端启动
sleep 3

# 启动前端  
echo "🎨 启动前端应用 (http://localhost:3000)..."
cd /Users/rg125/llm_study/interview-agent-platform/client
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ 应用已启动！"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📍 后端服务器: http://localhost:5000"
echo "📍 前端应用: http://localhost:3000"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "按 Ctrl+C 停止应用"
echo ""

# 等待进程
wait $BACKEND_PID $FRONTEND_PID
