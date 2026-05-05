# 面试准备 Agent 平台

一个全能的面试准备AI助手平台，帮助求职者从多个维度提升面试竞争力。

## 🎯 核心功能

### 1. **投递岗位与面试记录**
- 管理投递的职位信息
- 记录面试进展和反馈
- 追踪求职流程

### 2. **简历管理与优化**
- 上传和管理多份简历
- AI驱动的简历优化建议
- 针对不同岗位的简历定制

### 3. **面试准备**
- 根据岗位生成常见问题
- AI模型针对性指导
- 知识点和案例库

### 4. **模拟面试**
- 真实场景的面试模拟
- AI进行面试官角色互动
- 实时反馈和改进建议

### 5. **职业规划**
- 职业路径分析
- 技能发展建议
- 长期职业目标规划

## 💾 技术栈

- **前端**: React 18, TypeScript, Tailwind CSS
- **后端**: Node.js, Express, MongoDB
- **AI集成**: OpenAI API / Claude API
- **身份认证**: JWT
- **实时通讯**: Socket.IO

## 📁 项目结构

```
interview-agent-platform/
├── client/                 # React 前端应用
│   ├── src/
│   │   ├── components/     # React 组件
│   │   ├── pages/          # 页面组件
│   │   ├── services/       # API 服务
│   │   ├── hooks/          # 自定义 hooks
│   │   ├── context/        # React Context
│   │   └── App.tsx
│   └── package.json
├── server/                 # Node.js/Express 后端
│   ├── src/
│   │   ├── routes/         # API 路由
│   │   ├── controllers/    # 请求处理器
│   │   ├── models/         # 数据模型
│   │   ├── middleware/     # 中间件
│   │   ├── services/       # 业务逻辑
│   │   ├── config/         # 配置文件
│   │   └── server.ts
│   └── package.json
├── .env.example            # 环境变量示例
└── README.md
```

## 🚀 快速开始

### 前提条件
- Node.js >= 16
- MongoDB >= 5.0
- npm 或 yarn

### 安装依赖

```bash
# 安装后端依赖
cd server
npm install

# 安装前端依赖
cd ../client
npm install
```

### 环境配置

1. 复制环境变量文件:
```bash
cp .env.example .env
```

2. 配置以下环境变量:
- `MONGODB_URI`: MongoDB 连接字符串
- `JWT_SECRET`: JWT 密钥
- `OPENAI_API_KEY`: OpenAI API 密钥
- `BACKEND_URL`: 后端服务器地址
- `FRONTEND_URL`: 前端应用地址

### 启动应用

```bash
# 终端1: 启动后端服务器
cd server
npm start

# 终端2: 启动前端开发服务器
cd client
npm start
```

应用将在 `http://localhost:3000` 打开。

## 📚 API 文档

API 文档详见 [API.md](./server/API.md)

## 🔧 开发指南

### 项目架构

- **前端**: 组件化设计，使用 React Hooks 和 Context API 进行状态管理
- **后端**: RESTful API 设计，分层架构（路由 -> 控制器 -> 服务 -> 模型）
- **数据库**: MongoDB，集合设计参考 [数据库文档](./server/DATABASE.md)

### 代码规范

- 使用 TypeScript 增强类型安全
- 遵循 ESLint 和 Prettier 配置
- 组件和函数应有清晰的文档注释

## 🤝 贡献指南

欢迎提交 PR 和 Issue！

## 📄 许可证

MIT License
