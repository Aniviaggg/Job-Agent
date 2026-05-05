export interface User {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  targetPosition?: string;
  targetCompanies?: string[];
  skills?: string[];
  experience?: number;
}

export interface JobPosting {
  _id: string;
  userId: string;
  companyName: string;
  position: string;
  jobUrl?: string;
  description?: string;
  requirements?: string[];
  salary?: string;
  location?: string;
  status: 'saved' | 'applied' | 'rejected' | 'interview' | 'offer' | 'declined';
  appliedDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Resume {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  isPrimary: boolean;
  uploadedAt: Date;
  skills?: string[];
  experience?: string;
  education?: string;
  notes?: string;
  content?: string;
}

export interface InterviewRecord {
  _id: string;
  companyName: string;
  position: string;
  interviewType: 'phone' | 'video' | 'in-person' | 'online';
  interviewDate: Date;
  feedback: string;
  score?: number;
  questions?: string[];
  answers?: string[];
  nextRound?: boolean;
  notes?: string;
  createdAt: Date;
}

export interface InterviewPrep {
  _id: string;
  position: string;
  companyName?: string;
  commonQuestions: string[];
  prepNotes?: string;
}

export interface MockInterview {
  _id: string;
  title: string;
  position: string;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Array<{
    question: string;
    model_answer?: string;
    user_answer?: string;
    feedback?: string;
    score?: number;
  }>;
  totalScore?: number;
  feedback?: string;
  createdAt: Date;
}

export interface CareerPlan {
  _id: string;
  currentRole?: string;
  targetRole?: string;
  targetSalary?: number;
  timeline?: number;
  skills_to_develop?: string[];
  milestones?: Array<{
    title: string;
    date: Date;
    description?: string;
  }>;
  progress?: number;
  notes?: string;
}
