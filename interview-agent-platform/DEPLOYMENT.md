# 面试准备 Agent 平台 - 部署指南

## 项目结构

```
interview-agent-platform/
├── server/           # Node.js/Express 后端
├── client/           # React 前端
├── .env.example      # 环境变量示例
└── README.md         # 项目文档
```

## 前置要求

- Node.js >= 16
- MongoDB >= 5.0
- OpenAI API 密钥或 Claude API 密钥

## 快速开始

### 1. 环境配置

```bash
# 复制环境变量文件
cp .env.example .env

# 编辑 .env 填入必要的配置信息
```

### 2. 后端安装

```bash
cd server
npm install
```

### 3. 前端安装

```bash
cd client
npm install
```

### 4. 启动应用

#### 方式1：并行启动（推荐开发使用）

```bash
npm run dev
# 或
npm start
```

#### 方式2：分别启动

```bash
# 终端1: 启动后端
cd server
npm run dev

# 终端2: 启动前端
cd client
npm start
```

### 5. 访问应用

- 前端应用: http://localhost:3000
- 后端 API: http://localhost:5000

## 数据库配置

### MongoDB 本地开发

```bash
# macOS - 使用 Homebrew
brew services start mongodb-community

# 检查连接
mongosh

# 创建数据库
use interview-agent
```

### 在线 MongoDB

可使用 MongoDB Atlas（https://www.mongodb.com/cloud/atlas）

在 `.env` 中配置：
```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/interview-agent
```

## 功能模块

### 1. **投递岗位与面试记录** (`/job-postings`)
- 管理投递应聘的职位
- 记录面试进展
- 追踪求职流程

### 2. **简历管理与优化** (`/resumes`)
- 上传和管理多份简历
- AI 驱动的简历优化建议
- 针对不同职位的简历定制

### 3. **面试准备** (`/interview-prep`)
- 根据职位和公司生成面试问题
- AI 针对性指导
- 知识点和案例库

### 4. **模拟面试** (`/mock-interview`)
- 真实场景的面试模拟
- AI 进行面试官角色互动
- 实时反馈和改进建议

### 5. **职业规划** (`/career-plan`)
- 职业路径分析
- 技能发展路线图
- 长期职业目标规划

## API 端点

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/profile` - 获取用户信息
- `PUT /api/auth/profile` - 更新用户信息

### 职位
- `GET /api/jobs` - 获取所有职位
- `POST /api/jobs` - 创建职位
- `PUT /api/jobs/:id` - 更新职位
- `DELETE /api/jobs/:id` - 删除职位

### 简历
- `GET /api/resumes` - 获取所有简历
- `POST /api/resumes` - 上传简历
- `PUT /api/resumes/:id/primary` - 设置主简历
- `DELETE /api/resumes/:id` - 删除简历

### AI 服务
- `POST /api/ai/generate-questions` - 生成面试问题
- `POST /api/ai/generate-feedback` - 生成面试反馈
- `POST /api/ai/optimize-resume` - 优化简历
- `POST /api/ai/career-plan` - 生成职业规划

## 环境变量说明

```
# MongoDB 连接
MONGODB_URI=mongodb://localhost:27017/interview-agent

# JWT 配置
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# AI 配置
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key_here

# 服务器配置
PORT=5000
NODE_ENV=development
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# 日志级别
LOG_LEVEL=debug
```

## 故障排除

### MongoDB 连接失败

检查：
1. MongoDB 服务是否运行
2. `MONGODB_URI` 配置是否正确
3. MongoDB 用户权限

### API 请求失败

检查：
1. 后端服务是否运行（http://localhost:5000/health）
2. CORS 配置是否正确
3. JWT token 是否过期

### AI 功能不可用

检查：
1. OpenAI API 密钥是否正确
2. API 配额是否充足
3. 网络连接

## 开发指南

### 代码结构

**后端 (`server/src/`)**
- `models/` - 数据库模型
- `controllers/` - 请求处理器
- `services/` - 业务逻辑
- `routes/` - API 路由
- `middleware/` - 中间件
- `config/` - 配置文件

**前端 (`client/src/`)**
- `pages/` - 页面组件
- `components/` - 可复用组件
- `services/` - API 服务
- `store/` - 状态管理 (Zustand)
- `types/` - TypeScript 类型定义

### 代码规范

- 使用 TypeScript 增强类型安全
- 遵循 ESLint 和 Prettier 配置
- 组件和函数应有清晰的文档注释
- Git 提交消息应遵循 Conventional Commits

## 部署建议

### 生产环境配置

1. **后端部署**
   - 使用 PM2 或 Docker 容器化
   - 配置 HTTPS
   - 设置环境变量安全

2. **前端部署**
   - 构建优化版本
   - 使用 CDN 加速
   - 配置缓存策略

3. **数据库**
   - 使用 MongoDB Atlas 或托管 MongoDB 服务
   - 配置备份和恢复策略
   - 启用认证和加密

## 贡献指南

欢迎提交 Pull Request 和 Issue！

## 许可证

MIT License
