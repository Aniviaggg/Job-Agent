import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { JobPosting, Resume, InterviewRecord } from '../types';

interface AppStore {
  jobPostings: JobPosting[];
  resumes: Resume[];
  interviewRecords: InterviewRecord[];
  interviewQuestions: string[];
  setJobPostings: (postings: JobPosting[]) => void;
  setResumes: (resumes: Resume[]) => void;
  setInterviewRecords: (records: InterviewRecord[]) => void;
  setInterviewQuestions: (questions: string[]) => void;
  clearInterviewQuestions: () => void;
  addJobPosting: (posting: JobPosting) => void;
  updateJobPosting: (posting: JobPosting) => void;
  deleteJobPosting: (id: string) => void;
  addResume: (resume: Resume) => void;
  deleteResume: (id: string) => void;
  addInterviewRecord: (record: InterviewRecord) => void;
  deleteInterviewRecord: (id: string) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      jobPostings: [],
      resumes: [],
      interviewRecords: [],
      interviewQuestions: [],
      setJobPostings: (postings) => set({ jobPostings: postings }),
      setResumes: (resumes) => set({ resumes }),
      setInterviewRecords: (records) => set({ interviewRecords: records }),
      setInterviewQuestions: (questions) => set({ interviewQuestions: questions }),
      clearInterviewQuestions: () => set({ interviewQuestions: [] }),
      addJobPosting: (posting) =>
        set((state) => ({
          jobPostings: [posting, ...state.jobPostings],
        })),
      updateJobPosting: (posting) =>
        set((state) => ({
          jobPostings: state.jobPostings.map((p) => (p._id === posting._id ? posting : p)),
        })),
      deleteJobPosting: (id) =>
        set((state) => ({
          jobPostings: state.jobPostings.filter((p) => p._id !== id),
        })),
      addResume: (resume) =>
        set((state) => ({
          resumes: [resume, ...state.resumes],
        })),
      deleteResume: (id) =>
        set((state) => ({
          resumes: state.resumes.filter((r) => r._id !== id),
        })),
      addInterviewRecord: (record) =>
        set((state) => ({
          interviewRecords: [record, ...state.interviewRecords],
        })),
      deleteInterviewRecord: (id) =>
        set((state) => ({
          interviewRecords: state.interviewRecords.filter((r) => r._id !== id),
        })),
    }),
    {
      name: 'interview-agent-app-store',
      partialize: (state) => ({
        interviewQuestions: state.interviewQuestions,
      }),
    }
  )
);
