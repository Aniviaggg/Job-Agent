import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { connectDatabase } from './config/database';
import { authMiddleware, errorHandler } from './middleware/auth';

// 导入路由
import authRoutes from './routes/auth';
import jobPostingRoutes from './routes/jobPosting';
import resumeRoutes from './routes/resume';
import aiRoutes from './routes/ai';
import path from 'path';

const app: Express = express();

// 中间件
app.use(helmet());
app.use(cors(config.cors));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/jobs', authMiddleware, jobPostingRoutes);
app.use('/api/resumes', authMiddleware, resumeRoutes);
app.use('/api/ai', aiRoutes);

// 静态托管上传的简历文件
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
  });
});

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
const startServer = async () => {
  try {
    // 连接数据库
    await connectDatabase();

    app.listen(config.port, () => {
      console.log(`
╔════════════════════════════════════════════╗
║  Interview Agent Platform - Backend Server ║
╚════════════════════════════════════════════╝

✓ Server is running on ${config.urls.backend}
✓ Environment: ${config.nodeEnv}
✓ Database: ${config.mongodb.uri}

Ready to accept connections...
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\n\nShutting down gracefully...');
  process.exit(0);
});

startServer();
