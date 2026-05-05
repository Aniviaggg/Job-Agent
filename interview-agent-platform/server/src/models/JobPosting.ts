import mongoose from 'mongoose';
import { IUnifiedRecord } from '../types';

const jobPostingSchema = new mongoose.Schema<IUnifiedRecord>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    recordType: {
      type: String,
      enum: ['job', 'interview'],
      default: 'job',
      index: true,
    },
    jobUrl: String,
    description: String,
    requirements: [String],
    salary: String,
    location: String,
    status: {
      type: String,
      enum: ['saved', 'applied', 'rejected', 'interview', 'offer', 'declined'],
      default: 'saved',
    },
    date: Date,
    appliedDate: Date,
    interviewDate: Date,
    notes: String,
    comments: String,
    interviewType: {
      type: String,
      enum: ['phone', 'video', 'in-person', 'online'],
    },
    interviewers: [String],
    feedback: String,
    score: Number,
    questions: [String],
    answers: [String],
    nextRound: Boolean,
  },
  { timestamps: true }
);

export const JobPosting = mongoose.model<IUnifiedRecord>('JobPosting', jobPostingSchema);
