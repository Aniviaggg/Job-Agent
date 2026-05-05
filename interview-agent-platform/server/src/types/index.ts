export interface IUser {
  _id?: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  avatar?: string;
  targetPosition?: string;
  targetCompanies?: string[];
  skills?: string[];
  experience?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUnifiedRecord {
  _id?: string;
  userId: string;
  companyName: string;
  position: string;
  recordType: 'job' | 'interview';
  jobUrl?: string;
  description?: string;
  requirements?: string[];
  salary?: string;
  location?: string;
  status: 'saved' | 'applied' | 'rejected' | 'interview' | 'offer' | 'declined';
  date?: Date;
  appliedDate?: Date;
  interviewDate?: Date;
  notes?: string;
  comments?: string;
  interviewType?: 'phone' | 'video' | 'in-person' | 'online';
  interviewers?: string[];
  feedback?: string;
  score?: number;
  questions?: string[];
  answers?: string[];
  nextRound?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IJobPosting extends IUnifiedRecord {
  recordType: 'job';
}

export interface IInterviewRecord extends IUnifiedRecord {
  recordType: 'interview';
}

export interface IResume {
  _id?: string;
  userId: string;
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

export interface IInterviewPrep {
  _id?: string;
  userId: string;
  jobPostingId?: string;
  position: string;
  companyName?: string;
  commonQuestions: string[];
  prepNotes?: string;
  studyMaterials?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMockInterview {
  _id?: string;
  userId: string;
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
  recordingUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICareerPlan {
  _id?: string;
  userId: string;
  currentRole?: string;
  targetRole?: string;
  targetSalary?: number;
  timeline?: number; // 月份
  skills_to_develop?: string[];
  milestones?: Array<{
    title: string;
    date: Date;
    description?: string;
  }>;
  progress?: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
}
