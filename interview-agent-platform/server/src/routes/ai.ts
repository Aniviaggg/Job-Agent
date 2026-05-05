import { Router, Request, Response } from 'express';
import { AIService } from '../services/AIService';
import { authMiddleware } from '../middleware/auth';
import { SearchService } from '../services/SearchService';

const router = Router();

function mapErrorStatus(error: any) {
  const msg = (error && error.message) ? String(error.message).toLowerCase() : '';
  if (msg.includes('quota') || msg.includes('insufficientquotaerror') || msg.includes('rate limit') || msg.includes('429')) {
    return 429;
  }
  return 500;
}

/**
 * 生成面试问题
 */
router.post('/generate-questions', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { position, company, resumeId } = req.body;

    if (!position) {
      return res.status(400).json({
        success: false,
        message: 'Position is required',
      });
    }

    // 如果提供了 resumeId，从数据库加载简历内容
    let resumeContent: string | undefined = undefined;
    if (resumeId) {
      const { Resume } = await import('../models/Resume');
      const resume = await Resume.findById(resumeId);
      if (resume && resume.content) resumeContent = resume.content;
    }

    let searchContext = '';
    try {
      const searchResults = await SearchService.searchInterviewExperience(position, company, 5);
      if (searchResults.length) {
        searchContext = searchResults
          .map(
            (item, index) =>
              `${index + 1}. ${item.title}\n来源：${item.url}\n摘要：${item.snippet || '无摘要'}`
          )
          .join('\n\n');
      }
    } catch (searchError) {
      console.warn('Search interview experiences failed:', (searchError as any)?.message || searchError);
    }

    const questions = await AIService.generateInterviewQuestions(
      position,
      company,
      resumeContent,
      searchContext
    );

    return res.status(200).json({
      success: true,
      message: 'Questions generated',
      data: questions,
    });
  } catch (error: any) {
    const status = mapErrorStatus(error);
    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * 生成面试反馈
 */
router.post('/generate-feedback', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: 'Question and answer are required',
      });
    }

    const feedback = await AIService.generateFeedback(question, answer);

    return res.status(200).json({
      success: true,
      message: 'Feedback generated',
      data: feedback,
    });
  } catch (error: any) {
    const status = mapErrorStatus(error);
    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * 优化简历
 */
router.post('/optimize-resume', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { resumeContent, resumeId, targetPosition } = req.body;

    let contentToOptimize = resumeContent;

    if (!contentToOptimize && resumeId) {
      const { Resume } = await import('../models/Resume');
      const resume = await Resume.findById(resumeId);

      if (!resume) {
        return res.status(404).json({
          success: false,
          message: 'Resume not found',
        });
      }

      if (resume.userId !== req.user?.userId) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden',
        });
      }

      if (resume.content) {
        contentToOptimize = resume.content;
      }
    }

    if (!contentToOptimize) {
      return res.status(400).json({
        success: false,
        message: 'Resume file content is required',
      });
    }

    const suggestions = await AIService.optimizeResume(contentToOptimize, targetPosition);

    return res.status(200).json({
      success: true,
      message: 'Resume optimization suggestions generated',
      data: suggestions,
    });
  } catch (error: any) {
    const status = mapErrorStatus(error);
    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * 生成职业规划
 */
router.post('/career-plan', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { currentRole, targetRole, currentSkills } = req.body;

    if (!currentRole || !targetRole) {
      return res.status(400).json({
        success: false,
        message: 'Current role and target role are required',
      });
    }

    const careerPlan = await AIService.generateCareerPlan(
      currentRole,
      targetRole,
      currentSkills || []
    );

    return res.status(200).json({
      success: true,
      message: 'Career plan generated',
      data: careerPlan,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
