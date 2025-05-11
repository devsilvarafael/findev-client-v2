import api from '@/services/api';
import { Candidate, PaginatedResponse } from '@/types/candidate';

export async function fetchJobCandidates(jobId: string): Promise<PaginatedResponse<Candidate>> {
  const response = await api.get(`/candidature/job/${jobId}`);
  return response.data;
}

export async function updateCandidatureStatus(candidatureId: string, status: string): Promise<void> {
  await api.put(`/candidature/${candidatureId}/status?status=${status}`);
}
