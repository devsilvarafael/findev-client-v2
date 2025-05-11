import api from "@/services/api";
import { Job } from "@/types/Job";
import { PaginatedResponse } from "@/types/candidate";

export interface Skill {
  skillId: number;
  skillName: string;
  experienceYears: number;
}

export interface DeveloperDto {
  developerId: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  phone: string;
  portfolio: string;
  seniority: number;
  skills: Skill[];
}

export interface Company {
  name: string;
  isActive: boolean;
}

export interface Candidature {
  candidatureId: string;
  jobId: string;
  jobDescription: string;
  company: Company;
  developerDto: DeveloperDto;
  status: 'PENDING_REVIEW' | 'UNDER_REVIEW' | 'INTERVIEW_INVITED' | 'INTERVIEW_COMPLETED' | 'FEEDBACK_PROVIDED' | 'ACCEPTED' | 'REFUSED' | 'WITHDRAWN' | 'HIRED';
}

export const candidatureApi = {
  getDeveloperCandidatures: async (developerId: string): Promise<PaginatedResponse<Candidature>> => {
    const response = await api.get<PaginatedResponse<Candidature>>(`/candidature/developer/${developerId}`);
    return response.data;
  },

  unapplyFromJob: async (jobId: string, developerId: string): Promise<void> => {
    await api.delete(`/jobs/${jobId}/unapply/${developerId}`);
  },

  getJobDetails: async (jobId: string): Promise<Job> => {
    const response = await api.get<Job>(`/jobs/${jobId}`);
    return response.data;
  }
}; 