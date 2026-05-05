import mongoose from 'mongoose';
import { IResume } from '../types';

const resumeSchema = new mongoose.Schema<IResume>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    uploadedAt: {
      type: Date,
      default: () => new Date(),
    },
    skills: [String],
    experience: String,
    education: String,
    notes: String,
    // 提取的简历文本内容（用于AI检索/生成）
    content: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export const Resume = mongoose.model<IResume>('Resume', resumeSchema);
