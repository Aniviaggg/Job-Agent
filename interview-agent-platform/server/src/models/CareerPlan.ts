import mongoose from 'mongoose';
import { ICareerPlan } from '../types';

const careerPlanSchema = new mongoose.Schema<ICareerPlan>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    currentRole: String,
    targetRole: String,
    targetSalary: Number,
    timeline: Number, // 月份
    skills_to_develop: [String],
    milestones: [
      {
        title: String,
        date: Date,
        description: String,
      },
    ],
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    notes: String,
  },
  { timestamps: true }
);

export const CareerPlan = mongoose.model<ICareerPlan>('CareerPlan', careerPlanSchema);
