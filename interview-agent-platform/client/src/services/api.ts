import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 从 localStorage 读取 token
    this.token = localStorage.getItem('auth_token');
    this.updateAuthHeader();

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // 清除过期的 token
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
    this.updateAuthHeader();
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
    this.updateAuthHeader();
  }

  private updateAuthHeader() {
    if (this.token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  // 认证相关
  async register(email: string, password: string, name: string) {
    const { data } = await this.client.post('/auth/register', {
      email,
      password,
      name,
    });
    return data;
  }

  async login(email: string, password: string) {
    const { data } = await this.client.post('/auth/login', { email, password });
    return data;
  }

  async getProfile() {
    const { data } = await this.client.get('/auth/profile');
    return data;
  }

  async updateProfile(updates: any) {
    const { data } = await this.client.put('/auth/profile', updates);
    return data;
  }

  // 职位相关
  async getJobPostings() {
    const { data } = await this.client.get('/jobs');
    return data;
  }

  async createJobPosting(jobData: any) {
    const { data } = await this.client.post('/jobs', jobData);
    return data;
  }

  async updateJobPosting(id: string, updates: any) {
    const { data } = await this.client.put(`/jobs/${id}`, updates);
    return data;
  }

  async deleteJobPosting(id: string) {
    const { data } = await this.client.delete(`/jobs/${id}`);
    return data;
  }

  // 简历相关
  async getResumes() {
    const { data } = await this.client.get('/resumes');
    return data;
  }

  async uploadResume(resumeData: any) {
    // 支持 FormData 上传文件或普通 JSON
    if (resumeData instanceof FormData) {
      const { data } = await this.client.post('/resumes', resumeData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    }
    const { data } = await this.client.post('/resumes', resumeData);
    return data;
  }

  async setPrimaryResume(id: string) {
    const { data } = await this.client.put(`/resumes/${id}/primary`);
    return data;
  }

  async deleteResume(id: string) {
    const { data } = await this.client.delete(`/resumes/${id}`);
    return data;
  }

  // AI 相关
  async generateInterviewQuestions(position: string, company?: string, resumeId?: string) {
    const { data } = await this.client.post('/ai/generate-questions', {
      position,
      company,
      resumeId,
    });
    return data;
  }

  async generateFeedback(question: string, answer: string) {
    const { data } = await this.client.post('/ai/generate-feedback', {
      question,
      answer,
    });
    return data;
  }

  async optimizeResume(params: { resumeId?: string; resumeContent?: string; targetPosition?: string }) {
    const { data } = await this.client.post('/ai/optimize-resume', {
      resumeId: params.resumeId,
      resumeContent: params.resumeContent,
      targetPosition: params.targetPosition,
    });
    return data;
  }

  async generateCareerPlan(currentRole: string, targetRole: string, currentSkills?: string[]) {
    const { data } = await this.client.post('/ai/career-plan', {
      currentRole,
      targetRole,
      currentSkills,
    });
    return data;
  }
}

export const apiClient = new ApiClient();
