import { useUserContext } from "@/contexts/UserContext";
import api from "@/services/api";
import { Job } from "@/types/Job";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { FaClock } from "react-icons/fa";
import { IoLocation } from "react-icons/io5";
import { toast } from "sonner";
import { FaRegCircleCheck } from "react-icons/fa6";

interface JobDetailsPanelProps {
  job: Job;
}

export const JobDetailsPanel = ({ job }: JobDetailsPanelProps) => {
  const { simpleUserJson } = useUserContext();

  const applyToJob = async () => {
    try {
      const response = await api.post(`/jobs/${job.id}/apply`, {
        developerId: simpleUserJson?.id,
      });

      toast.success("Candidatura enviada com sucesso!");

      return response.data;
    } catch (err: any) {
      toast.error(err.response.data);
    }
  };

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm h-fit">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{job.title}</h2>
          <button
            onClick={applyToJob}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Candidatar
          </button>
        </div>
        <div className="mt-2">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              job.priority === "HIGH"
                ? "bg-blue-100 text-blue-800"
                : job.priority === "MEDIUM"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {job.priority === "HIGH"
              ? "Alta prioridade"
              : job.priority === "MEDIUM"
              ? "Prioridade média"
              : "Baixa prioridade"}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-gray-700 mb-2">
          Requisitos Obrigatórios
        </h3>
        <div className="space-y-2">
          {job.requirements?.map((req: any, index: number) => (
            <div key={index} className="flex gap-2 my-4 text-sm items-center">
              <FaRegCircleCheck className="text-green-500" />
              <span className="font-bold text-gray-600">Tecnologia:</span>
              <span className="text-gray-600">{req.name}</span>
              <span className="font-bold text-gray-600">Experiência:</span>{" "}
              <span className="text-gray-600">
                {req.experienceYears} ano{req.experienceYears !== 1 ? "s" : ""}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-2">Descrição</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-gray-700">Responsabilidades</h4>
            <ul className="list-disc pl-5 space-y-1 mt-2 text-sm text-gray-600">
              {job.description?.split("\n").map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium">Salário e Benefícios</h4>
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <p>{currencyFormatter(job.salary)}</p>
              {job.benefits?.map((benefit, index) => (
                <p key={index}>{benefit}</p>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium">Localização e Horário</h4>
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              <IoLocation className="text-gray-400" />
              <span>{job.location || "Remoto"}</span>
              <span>•</span>
              <FaClock className="text-gray-400" />
              <span>{job.minWeekHours} hrs/sem</span>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="mb-6">
        <h3 className="font-medium mb-2">Histórico da vaga</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Candidatura enviada</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Candidatura visualizada</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Convite de entrevista recebido</span>
          </div>
        </div>
      </div> */}
    </div>
  );
};
