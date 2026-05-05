import { Request, Response } from 'express';
import { Resume } from '../models/Resume';
import fs from 'fs';
import path from 'path';

export class ResumeController {
  /**
   * 上传简历（接收 PDF 文件）
   */
  static async uploadResume(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      // multer 将文件挂载在 req.file
      const file = (req as any).file;
      if (!file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const uploadsDir = path.resolve(__dirname, '../../uploads');
      const fileUrl = `/uploads/${path.basename(file.path)}`;

      // 尝试从 PDF 中提取文本（可选），使用 pdf-parse
      let content = '';
      try {
        const pdfParse = require('pdf-parse');
        const dataBuffer = fs.readFileSync(file.path);
        const parsed = await pdfParse(dataBuffer);
        content = parsed.text || '';
      } catch (err) {
        // 如果无法解析 PDF，忽略但保留文件
        console.warn('PDF parse failed:', (err as any)?.message || err);
      }

      const resume = new Resume({
        userId: req.user.userId,
        fileName: file.originalname,
        fileUrl,
        fileSize: file.size,
        isPrimary: false,
        content,
      });
      await resume.save();

      return res.status(201).json({
        success: true,
        message: 'Resume uploaded',
        data: resume,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * 获取用户的所有简历
   */
  static async getUserResumes(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const resumes = await Resume.find({ userId: req.user.userId }).sort({
        uploadedAt: -1,
      });

      return res.status(200).json({
        success: true,
        message: 'Resumes retrieved',
        data: resumes,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * 设置主简历
   */
  static async setPrimaryResume(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      // 先将所有简历设置为非主
      await Resume.updateMany({ userId: req.user.userId }, { isPrimary: false });

      // 设置指定简历为主
      const resume = await Resume.findByIdAndUpdate(req.params.id, { isPrimary: true }, {
        new: true,
      });

      if (!resume || resume.userId !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Primary resume set',
        data: resume,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * 删除简历
   */
  static async deleteResume(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const resume = await Resume.findByIdAndDelete(req.params.id);

      if (!resume || resume.userId !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Resume deleted',
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
