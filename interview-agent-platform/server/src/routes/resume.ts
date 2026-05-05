import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ResumeController } from '../controllers/ResumeController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// 确保 uploads 目录存在
const uploadsDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

// 配置 multer 存储
const storage = multer.diskStorage({
	destination: function (_req: any, _file: any, cb: any) {
		cb(null, uploadsDir);
	},
	filename: function (_req: any, file: any, cb: any) {
		const unique = `${Date.now()}-${file.originalname}`;
		cb(null, unique);
	},
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// 简历路由，使用 multipart/form-data 上传文件字段名为 `file`
router.post('/', authMiddleware, upload.single('file'), ResumeController.uploadResume);
router.get('/', authMiddleware, ResumeController.getUserResumes);
router.put('/:id/primary', authMiddleware, ResumeController.setPrimaryResume);
router.delete('/:id', authMiddleware, ResumeController.deleteResume);

export default router;
