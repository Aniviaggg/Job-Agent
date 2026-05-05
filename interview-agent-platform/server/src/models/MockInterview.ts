import mongoose from 'mongoose';
import { IMockInterview } from '../types';

const mockInterviewSchema = new mongoose.Schema<IMockInterview>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    duration: Number,
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    questions: [
      {
        question: String,
        model_answer: String,
        user_answer: String,
        feedback: String,
        score: Number,
      },
    ],
    totalScore: Number,
    feedback: String,
    recordingUrl: String,
  },
  { timestamps: true }
);

export const MockInterview = mongoose.model<IMockInterview>(
  'MockInterview',
  mockInterviewSchema
);
