import { ICompanyProps } from "./Company";
import { Developer } from "./Developer";

export interface Job {
  id: string;
  title: string;
  description: string;
  status: number;
  salary: number;
  expirationDate: string;
  contractType: string;
  priority: string;
  location: string;
  createdAt: string;
  minWeekHours: number;
  maxWeekHours: number;
  workModality: string;
  workLocation: string;
  company: ICompanyProps;
  recruiter: {
    recruiterId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyId: string;
  };
  candidatures: Developer[];
  requirements: {
    name: string;
    experienceYears: number;
  }[]
  benefits: string[];
}
