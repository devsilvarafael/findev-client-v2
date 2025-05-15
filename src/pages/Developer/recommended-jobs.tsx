import { useState } from "react";
import { Menu } from "@/components/Menu/Menu";
import { DefaultLayout } from "@/layouts/DefaultLayout";
import api from "@/services/api";
import { Job } from "@/types/Job";
import { useQuery } from "@tanstack/react-query";
import JobCardItem from "@/components/Jobs/JobCardItem";
import { JobDetailsPanel } from "@/pages/Developer/components/job-details-panel";

export const RecommendedJobs = () => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const { data: userJobs } = useQuery({
    queryKey: ["userJobs"],
    queryFn: async () => {
      const existsStorage: string | null = localStorage.getItem("@User");
      const user = existsStorage ? JSON.parse(existsStorage) : null;

      const response = await api.get("/jobs/matching", {
        params: {
          developerId: user?.id,
        },
      });

      return response.data;
    },
  });

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
  };

  return (
    <DefaultLayout leftSideBar={<Menu />}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Vagas recomendadas</h1>

        <div className="flex gap-6">
          <div className="w-1/2 bg-white p-2 rounded-md shadow-sm h-full">
            {userJobs?.content.length === 0 && (
              <div className="border rounded-lg p-6 h-fit flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">
                  Nenhuma vaga recomendada encontrada
                </p>
              </div>
            )}
            {userJobs?.content.map((job: Job) => (
              <div
                key={job.id}
                className={`my-2 border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                  selectedJob?.id === job.id ? "border-blue-500 bg-blue-50" : ""
                }`}
                onClick={() => handleJobClick(job)}
              >
                <JobCardItem job={job} />
              </div>
            ))}
          </div>

          <div className="w-2xl sticky top-6 h-[calc(100vh-3rem)] overflow-y-auto">
            {selectedJob ? (
              <JobDetailsPanel job={selectedJob} />
            ) : (
              <div className="border rounded-lg p-6 h-fit flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">
                  Selecione uma vaga para ver os detalhes
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};
