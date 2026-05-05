# ⚡ 快速参考卡

## 🚀 30 秒快速开始

```bash
cd /Users/rg125/llm_study/interview-agent-platform

# 1. 配置 .env（第一次）
cp .env.example .env
# 编辑 .env：
#   - MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/interview-agent
#   - OPENAI_API_KEY=sk-...

# 2. 安装依赖（第一次）
npm install

# 3. 启动
npm run dev

# 4. 访问
# 🌐 前端: http://localhost:3000
# 🔌 后端: http://localhost:5000
```

## 📁 重要文件位置

| 文件 | 位置 |
|------|------|
| 项目配置 | `/Users/rg125/llm_study/interview-agent-platform/.env` |
| 后端代码 | `/server/src/` |
| 前端代码 | `/client/src/` |
| API 文档 | `README.md` 或 `DEPLOYMENT.md` |
| 测试步骤 | `TESTING.md` |
| 项目总结 | `PROJECT_SUMMARY.md` |

## 🔧 开发命令

### 后端
```bash
cd server
npm run dev      # 开发模式（自动重启）
npm run build    # 编译 TypeScript
npm start        # 生产模式
npm run lint     # 检查代码
npm run format   # 格式化代码
```

### 前端
```bash
cd client
npm start        # 开发服务器
npm run build    # 生产构建
npm run test     # 运行测试
```

### 整体
```bash
npm run dev           # 同时启动前后端
npm run dev:server   # 仅后端
npm run dev:client   # 仅前端
npm run build        # 生产构建
```

## 🔑 必要的外部服务

### 1. MongoDB（数据库）
- **选项 A**（推荐）: MongoDB Atlas - https://www.mongodb.com/cloud/atlas
  ```
  MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/interview-agent
  ```
- **选项 B**: 本地 MongoDB
  ```bash
  brew services start mongodb-community
  MONGODB_URI=mongodb://localhost:27017/interview-agent
  ```

### 2. OpenAI API（AI功能）
- 获取密钥: https://platform.openai.com/api-keys
  ```
  OPENAI_API_KEY=sk-...
  ```

## 🧪 测试 API

### 注册
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123","name":"张三"}'
```

### 登录
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}'
```

## ⚠️ 常见问题

| 问题 | 解决方案 |
|------|--------|
| `MongoDB connection refused` | 启动 MongoDB 或配置 MongoDB Atlas |
| `Cannot find module` | 运行 `npm install` |
| `Port 5000 already in use` | 更改 `.env` 中的 PORT 或 `kill $(lsof -t -i:5000)` |
| `401 Unauthorized` | 检查 JWT token 或 OPENAI_API_KEY |
| `CORS error` | 检查 `.env` 中的 FRONTEND_URL |

## 📊 项目信息

```
语言: TypeScript, React, Node.js
框架: Express, React 18
数据库: MongoDB + Mongoose
UI: Tailwind CSS + react-hot-toast
状态管理: Zustand
前后端通信: Axios
认证: JWT
AI集成: OpenAI API
```

## 🎯 功能模块地址

| 功能 | URL |
|------|-----|
| 注册/登录 | http://localhost:3000/login |
| 仪表板 | http://localhost:3000/ |
| 职位管理 | http://localhost:3000/job-postings |
| 简历管理 | http://localhost:3000/resumes |
| 面试准备 | http://localhost:3000/interview-prep |
| 模拟面试 | http://localhost:3000/mock-interview |
| 职业规划 | http://localhost:3000/career-plan |

## 📝 默认配置

```env
PORT=5000
NODE_ENV=development
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
LOG_LEVEL=debug
```

## 🚀 部署命令

```bash
# 后端
cd server
npm run build
pm2 start dist/server.js

# 前端
cd client
npm run build
vercel deploy --prod
```

## 📞 需要帮助？

1. 查看 `README.md` - 完整项目文档
2. 查看 `TESTING.md` - 详细测试步骤
3. 查看 `DEPLOYMENT.md` - 部署说明
4. 查看 `PROJECT_SUMMARY.md` - 项目总结

---

**🎉 项目已完全准备就绪！**
