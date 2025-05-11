export type CandidatureStatus =
  | 'PENDING_REVIEW'
  | 'UNDER_REVIEW'
  | 'INTERVIEW_INVITED'
  | 'INTERVIEW_COMPLETED'
  | 'FEEDBACK_PROVIDED'
  | 'ACCEPTED'
  | 'REFUSED'
  | 'WITHDRAWN'
  | 'HIRED';

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

export interface Candidate {
  candidatureId: string;
  developer: {
    developerId: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
    phone: string;
    portfolio: string;
    seniority: number;
    skills: {
      skillId: number;
      skillName: string;
      experienceYears: number;
    }[];
  };
  status: CandidatureStatus;
} 