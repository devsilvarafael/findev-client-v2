import api from "@/services/api";
import { PaginatedResponse } from "@/types/candidate";

export type WorkModality = 'REMOTE' | 'HYBRID' | 'ON_SITE';
export type ContractType = 'CLT' | 'PJ' | 'FREELANCER';

export interface Job {
  id: string;
  title: string;
  description: string;
  workLocation: string;
  workModality: WorkModality;
  contractType: ContractType;
  salary: number;
  minWeekHours: number;
  maxWeekHours: number;
  expirationDate: string;
  status: number;
  priority: number;
  companyId: string;
  recruiterId: string;
  requirements: Array<{
    name: string;
    experienceYears: number;
  }>;
}

export const jobApi = {
  getRecruiterJobs: async (recruiterId: string): Promise<PaginatedResponse<Job>> => {
    const response = await api.get<PaginatedResponse<Job>>(`/jobs/recruiter/${recruiterId}`);
    return response.data;
  },

  getJobDetails: async (jobId: string): Promise<Job> => {
    const response = await api.get<Job>(`/jobs/${jobId}`);
    return response.data;
  },

  deleteJob: async (jobId: string): Promise<void> => {
    await api.delete(`/jobs/${jobId}`);
  },

  updateJob: async (jobId: string, data: Partial<Job>): Promise<Job> => {
    console.log(data)
    const response = await api.put<Job>(`/jobs/${jobId}`, data);
    return response.data;
  },

  createJob: async (data: Omit<Job, 'id'>): Promise<Job> => {
    const response = await api.post<Job>('/jobs', data);
    return response.data;
  }
}; 