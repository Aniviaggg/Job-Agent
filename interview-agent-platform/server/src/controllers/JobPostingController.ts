import { Request, Response } from 'express';
import { JobPosting } from '../models/JobPosting';

const normalizeRecordPayload = (body: Record<string, any>) => {
  const recordType = body.recordType || body.type || (body.interviewType ? 'interview' : 'job');
  const unifiedDate = body.date || body.appliedDate || body.interviewDate || null;
  const comments = body.comments ?? body.notes ?? body.feedback ?? '';

  const payload: Record<string, any> = {
    ...body,
    recordType,
    comments,
    notes: comments,
  };

  if (unifiedDate) {
    payload.date = unifiedDate;
    payload.appliedDate = unifiedDate;
    payload.interviewDate = unifiedDate;
  }

  return payload;
};

export class JobPostingController {
  /**
   * 创建职位记录
   */
  static async createJobPosting(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const jobPosting = new JobPosting({
        ...normalizeRecordPayload(req.body),
        userId: req.user.userId,
      });
      await jobPosting.save();

      return res.status(201).json({
        success: true,
        message: 'Job posting created',
        data: jobPosting,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * 获取用户的所有职位
   */
  static async getUserJobPostings(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const jobPostings = await JobPosting.find({ userId: req.user.userId }).sort({
        createdAt: -1,
      });

      return res.status(200).json({
        success: true,
        message: 'Job postings retrieved',
        data: jobPostings,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * 更新职位状态
   */
  static async updateJobPosting(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const jobPosting = await JobPosting.findByIdAndUpdate(
        req.params.id,
        normalizeRecordPayload(req.body),
        {
          new: true,
        }
      );

      if (!jobPosting || jobPosting.userId !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Job posting updated',
        data: jobPosting,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * 删除职位记录
   */
  static async deleteJobPosting(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const jobPosting = await JobPosting.findByIdAndDelete(req.params.id);

      if (!jobPosting || jobPosting.userId !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Job posting deleted',
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
