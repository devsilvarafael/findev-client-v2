import { RecommendedJobs } from "@/pages/Developer/recommended-jobs";
import { RegisterDeveloper } from "@/pages/Developer/register-developer";
import { DeveloperCandidatures } from "@/pages/DeveloperCandidatures";
import { JobCandidates } from "@/pages/Recruiter/JobCandidates";
import { JobAnnouncements } from "@/pages/Recruiter/JobAnnouncements";
import { NewJob } from "@/pages/Recruiter/NewJob";
import { LoginPage } from "@/pages/login";
import { Register } from "@/pages/register";
import { createBrowserRouter } from "react-router-dom";

import { CompanyRecruiters } from "@/pages/Admin/CompanyRecruiters";
import { CompanyJobs } from "@/pages/Admin/CompanyJobs";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import JobCandidatesKanbanPage from '@/pages/Admin/JobCandidatesKanbanPage';
import { RecruiterRegister } from "@/pages/Recruiter/RecruiterRegister";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />
  },
  {
    path: "/home",
    element: <RecommendedJobs />
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/register/developer",
    element: <RegisterDeveloper />
  },
  {
    path: "/register/recruiter",
    element: <RecruiterRegister />
  },
  {
    path: "/applications",
    element: <DeveloperCandidatures />
  },
  {
    path: "/jobs/:jobId/candidates",
    element: <JobCandidates />
  },
  {
    path: "/jobs/announces",
    element: <JobAnnouncements />
  },
  {
    path: "/jobs/new",
    element: <NewJob />
  },
  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={["ADMINISTRATOR"]} />,
    children: [
      {
        path: "recruiters/:companyId",
        element: <CompanyRecruiters />,
      },
      {
        path: "jobs/:companyId",
        element: <CompanyJobs />,
      },
      {
        path: "jobs/:companyId/:jobId/candidates",
        element: <JobCandidatesKanbanPage />,
      },
    ],
  },
])