# 面试准备 Agent 平台 - 项目指南

这是一个完整的全栈 AI 驱动的面试准备平台。

## 项目概述

平台包含以下核心功能模块：
1. **投递岗位与面试记录** - 管理求职信息
2. **简历管理与优化** - AI 优化简历
3. **面试准备** - 生成面试问题
4. **模拟面试** - AI 进行实时面试
5. **职业规划** - 职业发展建议

## 技术架构

### 前端 (React + TypeScript)
- 位置: `/client`
- 页面组件在 `src/pages/` 目录
- 状态管理使用 Zustand
- 样式使用 Tailwind CSS

### 后端 (Node.js/Express + TypeScript)
- 位置: `/server`
- API 路由在 `src/routes/` 目录
- 业务逻辑在 `src/services/` 目录
- 数据模型在 `src/models/` 目录

### 数据库
- MongoDB 存储用户数据、职位记录、简历等

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 填入 MongoDB 连接和 OpenAI API 密钥
```

### 3. 启动应用
```bash
npm run dev
```

应用将在以下地址运行：
- 前端: http://localhost:3000
- 后端 API: http://localhost:5000

## 项目文件说明

### 后端核心文件
- `server/src/server.ts` - 主服务器文件
- `server/src/config/database.ts` - 数据库配置
- `server/src/models/` - MongoDB 数据模型
- `server/src/services/` - 业务逻辑（认证、AI）
- `server/src/controllers/` - 请求处理器
- `server/src/routes/` - API 路由
- `server/src/middleware/auth.ts` - 认证中间件

### 前端核心文件
- `client/src/App.tsx` - 主应用组件和路由
- `client/src/pages/` - 各功能页面
- `client/src/store/` - Zustand 状态管理
- `client/src/services/api.ts` - API 调用封装
- `client/src/types/` - TypeScript 类型定义

## API 端点

### 认证
- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录  
- `GET /api/auth/profile` - 获取用户信息
- `PUT /api/auth/profile` - 更新用户信息

### 职位
- `GET /api/jobs` - 获取职位列表
- `POST /api/jobs` - 添加职位
- `PUT /api/jobs/:id` - 更新职位
- `DELETE /api/jobs/:id` - 删除职位

### 简历
- `GET /api/resumes` - 获取简历列表
- `POST /api/resumes` - 上传简历
- `PUT /api/resumes/:id/primary` - 设置主简历
- `DELETE /api/resumes/:id` - 删除简历

### AI 服务
- `POST /api/ai/generate-questions` - 生成面试问题
- `POST /api/ai/generate-feedback` - 生成面试反馈
- `POST /api/ai/optimize-resume` - 优化简历
- `POST /api/ai/career-plan` - 生成职业规划

## 数据库集合

- `users` - 用户信息
- `jobpostings` - 投递的职位
- `interviewrecords` - 面试记录
- `resumes` - 用户简历
- `interviewpreps` - 面试准备
- `mockinterviews` - 模拟面试记录
- `careerplans` - 职业规划

## 开发注意事项

1. **环境变量** - 复制 `.env.example` 为 `.env` 并配置
2. **MongoDB** - 需要本地或远程 MongoDB 实例
3. **OpenAI API** - 需要有效的 API 密钥
4. **TypeScript** - 后端和前端都使用 TypeScript

## 常见命令

```bash
# 同时启动前后端
npm run dev

# 只启动后端（开发模式）
npm run dev:server

# 只启动前端
npm run dev:client

# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

## 下一步

1. 配置 MongoDB 数据库
2. 添加 OpenAI API 密钥
3. 启动应用并测试各功能模块
4. 根据需要扩展功能

更多详情请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)
