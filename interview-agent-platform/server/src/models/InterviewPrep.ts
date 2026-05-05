import mongoose from 'mongoose';
import { IInterviewPrep } from '../types';

const interviewPrepSchema = new mongoose.Schema<IInterviewPrep>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    jobPostingId: String,
    position: {
      type: String,
      required: true,
    },
    companyName: String,
    commonQuestions: [String],
    prepNotes: String,
    studyMaterials: [String],
  },
  { timestamps: true }
);

export const InterviewPrep = mongoose.model<IInterviewPrep>(
  'InterviewPrep',
  interviewPrepSchema
);
