import mongoose from 'mongoose';
import { IUnifiedRecord } from '../types';
import { JobPosting } from './JobPosting';

// 保留旧导出名，但底层使用同一个统一集合 JobPosting
export const InterviewRecord = JobPosting as mongoose.Model<IUnifiedRecord>;
