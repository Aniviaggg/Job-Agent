import { Router } from 'express';
import { JobPostingController } from '../controllers/JobPostingController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// 职位路由
router.post('/', authMiddleware, JobPostingController.createJobPosting);
router.get('/', authMiddleware, JobPostingController.getUserJobPostings);
router.put('/:id', authMiddleware, JobPostingController.updateJobPosting);
router.delete('/:id', authMiddleware, JobPostingController.deleteJobPosting);

export default router;
