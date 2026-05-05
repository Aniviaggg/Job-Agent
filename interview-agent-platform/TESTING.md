# 面试准备 Agent 平台 - 测试指南

## 项目状态

✅ **项目已完全创建**
- ✅ 后端完整（Node.js/Express + MongoDB + AI 集成）
- ✅ 前端完整（React + TypeScript + Zustand）
- ✅ 数据库模型完整（7 个集合）
- ✅ API 路由完整（认证、职位、简历、AI 服务）
- ✅ 依赖已安装
- ✅ 代码已编译

## 📋 测试步骤

### 1. 设置 MongoDB 数据库

有两种方式使用 MongoDB：

#### 方式 A：MongoDB Atlas（推荐云方案）

1. 访问 https://www.mongodb.com/cloud/atlas
2. 创建免费账户
3. 创建新集群（Shared Cluster 免费）
4. 获取连接字符串
5. 更新 `.env` 文件：

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/interview-agent
```

#### 方式 B：本地 MongoDB

```bash
# macOS - 使用 Homebrew 安装
brew tap mongodb/brew
brew install mongodb-community

# 启动 MongoDB
brew services start mongodb-community

# 验证连接
mongosh

use interview-agent
```

### 2. 配置 OpenAI API（必需）

1. 获取 OpenAI API 密钥：https://platform.openai.com/api-keys
2. 更新 `.env` 文件：

```bash
OPENAI_API_KEY=sk-...your-key-here...
```

### 3. 其他环境配置

编辑 `.env` 文件，设置正确的值：

```bash
# JWT 配置
JWT_SECRET=your_super_secret_key_change_me
JWT_EXPIRE=7d

# 服务器配置
PORT=5000
NODE_ENV=development
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

### 4. 启动开发服务器

#### 集成启动（推荐）

```bash
cd /Users/rg125/llm_study/interview-agent-platform

# 确保依赖已安装
npm install

# 同时启动前端和后端
npm run dev
```

#### 分别启动

```bash
# 终端 1：启动后端
cd /Users/rg125/llm_study/interview-agent-platform/server
npm run dev

# 终端 2：启动前端
cd /Users/rg125/llm_study/interview-agent-platform/client
npm start
```

### 5. 访问应用

- 🌐 **前端**: http://localhost:3000
- 🔌 **后端 API**: http://localhost:5000
- ✅ **健康检查**: http://localhost:5000/health

## 🧪 功能测试流程

### 测试 1：用户认证

#### 注册
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "张三"
  }'
```

**预期响应**：
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "email": "test@example.com", "name": "张三" },
    "token": "eyJhbGc..."
  }
}
```

#### 登录
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 测试 2：职位管理

#### 获取职位列表
```bash
curl -X GET http://localhost:5000/api/jobs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 添加职位
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "阿里巴巴",
    "position": "前端工程师",
    "jobUrl": "https://alibaba.com/jobs/123",
    "description": "招聘前端工程师",
    "salary": "15k-25k",
    "location": "杭州",
    "status": "applied"
  }'
```

### 测试 3：AI 功能

#### 生成面试问题
```bash
curl -X POST http://localhost:5000/api/ai/generate-questions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "position": "前端工程师",
    "company": "阿里巴巴"
  }'
```

#### 生成面试反馈
```bash
curl -X POST http://localhost:5000/api/ai/generate-feedback \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "你在 React 项目中如何处理状态管理？",
    "answer": "我通常使用 Redux 或者 Zustand..."
  }'
```

#### 优化简历
```bash
curl -X POST http://localhost:5000/api/ai/optimize-resume \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "resumeContent": "个人简历内容...",
    "targetPosition": "前端工程师"
  }'
```

#### 生成职业规划
```bash
curl -X POST http://localhost:5000/api/ai/career-plan \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "currentRole": "初级前端工程师",
    "targetRole": "高级前端工程师",
    "currentSkills": ["React", "Vue", "TypeScript"]
  }'
```

## 🌐 前端功能测试

### 1. 注册与登录

访问 http://localhost:3000
1. 点击"立即注册"
2. 填写注册表单
3. 创建账户后自动登录
4. 重定向到仪表板

### 2. 投递岗位管理

1. 点击"投递岗位与面试记录"卡片
2. 点击"添加职位"按钮
3. 填写职位信息（公司、职位、薪资等）
4. 点击"保存"
5. 验证职位出现在列表中

### 3. 简历管理

1. 点击"简历管理与优化"卡片
2. 在右侧面板输入简历内容
3. 也可选择输入目标职位
4. 点击"获取优化建议"
5. 等待 AI 生成优化建议

### 4. 面试准备

1. 点击"面试准备"卡片
2. 输入职位名称（和公司名称）
3. 点击"生成问题"
4. 查看生成的面试问题列表

### 5. 模拟面试

1. 点击"模拟面试"卡片
2. 输入职位名称和难度级别
3. 点击"开始模拟面试"
4. 回答自动生成的问题
5. 点击"获取反馈"获取 AI 评价
6. 继续下一题或完成

### 6. 职业规划

1. 点击"职业规划"卡片
2. 输入当前职位和目标职位
3. 可选：输入现有技能
4. 点击"生成规划"
5. 查看职业发展建议

## 🛠️ 常见问题排查

### 问题 1：MongoDB 连接失败

**错误**：`MongoDB connection failed: connect ECONNREFUSED 127.0.0.1:27017`

**解决方案**：
1. 检查 MongoDB 是否在运行：`pgrep -i mongod`
2. 如果未运行，启动 MongoDB：`brew services start mongodb-community`
3. 或改用 MongoDB Atlas（云数据库）

### 问题 2：OpenAI API 密钥错误

**错误**：`401 Unauthorized: Invalid OpenAI API key`

**解决方案**：
1. 检查 API 密钥是否复制正确
2. 访问 https://platform.openai.com/account/api-keys 检查
3. 确认 API 配额未耗尽
4. 重启后端：`npm run dev`

### 问题 3：前端无法连接后端

**错误**：`POST http://localhost:5000/api/auth/login 404 (Not Found)`

**解决方案**：
1. 检查后端是否运行：`curl http://localhost:5000/health`
2. 检查 CORS 配置是否正确
3. 确认 `.env` 中的 `BACKEND_URL` 正确
4. 重启后端服务

### 问题 4：TypeScript 编译错误

**解决方案**：
```bash
cd server
npm run build
# 或
npm run dev  # 自动编译
```

## 📊 测试覆盖范围

### 后端 API 端点测试

- ✅ `POST /api/auth/register` - 用户注册
- ✅ `POST /api/auth/login` - 用户登录
- ✅ `GET /api/auth/profile` - 获取用户信息
- ✅ `PUT /api/auth/profile` - 更新用户信息
- ✅ `GET /api/jobs` - 获取职位列表
- ✅ `POST /api/jobs` - 创建职位
- ✅ `PUT /api/jobs/:id` - 更新职位
- ✅ `DELETE /api/jobs/:id` - 删除职位
- ✅ `GET /api/resumes` - 获取简历
- ✅ `POST /api/resumes` - 上传简历
- ✅ `PUT /api/resumes/:id/primary` - 设置主简历
- ✅ `DELETE /api/resumes/:id` - 删除简历
- ✅ `POST /api/ai/generate-questions` - 生成问题
- ✅ `POST /api/ai/generate-feedback` - 生成反馈
- ✅ `POST /api/ai/optimize-resume` - 优化简历
- ✅ `POST /api/ai/career-plan` - 生成职业规划

### 前端功能测试

- ✅ 用户注册和登录
- ✅ 仪表板导航
- ✅ 投递岗位管理（增删改）
- ✅ 简历上传和优化
- ✅ 面试问题生成
- ✅ 模拟面试流程
- ✅ 职业规划建议

## 🚀 生产部署

### 后端部署

```bash
# 构建
npm run build:server

# 使用 PM2 部署
npm install -g pm2
pm2 start dist/server.js --name "interview-api"
pm2 save
pm2 startup
```

### 前端部署

```bash
# 构建
npm run build:client

# 部署到 Vercel
cd client
vercel
```

## 📝 测试检查清单

- [ ] MongoDB 已连接
- [ ] OpenAI API 密钥已配置
- [ ] 后端服务器运行正常
- [ ] 前端服务器运行正常
- [ ] 用户可以注册和登录
- [ ] 职位管理功能正常
- [ ] AI 功能生成内容正常
- [ ] 所有页面导航正常
- [ ] 没有控制台错误
- [ ] 网络请求状态码正确

## 📞 获取帮助

如果遇到问题，请检查：

1. 终端输出中的错误信息
2. 浏览器开发者工具的 Console 标签
3. Network 标签查看 API 请求
4. 查看后端日志（`/tmp/server.log`）

## 下一步建议

1. 配置生产环境数据库
2. 添加单元和集成测试
3. 配置 CI/CD 流程
4. 部署到云平台（AWS/阿里云/腾讯云）
5. 添加监控和日志系统
6. 实现更多 AI 功能

---

**项目完全就绪！按照本指南进行测试和部署。**
