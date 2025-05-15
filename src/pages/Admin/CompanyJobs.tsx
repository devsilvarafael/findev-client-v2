import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { DefaultLayout } from "@/layouts/DefaultLayout";
import { Menu } from "@/components/Menu/Menu";
import api from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye, Pencil, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, useFieldArray } from "react-hook-form";
import { jobApi, ContractType, WorkModality } from "@/services/job";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Benefit {
  name?: string;
}

interface Candidature {
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
  status: string;
}

interface Requirement {
  name: string;
  experienceYears: number;
}

interface Job {
  id: string;
  title: string;
  description: string;
  status: number;
  salary: number;
  expirationDate: string;
  createdAt: string;
  contractType: string;
  minWeekHours: number;
  maxWeekHours: number;
  workModality: string;
  workLocation: string;
  company: {
    companyId: string;
    name: string;
    companyLogo: string;
  };
  recruiter: {
    recruiterId: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  priority: string;
  benefits: Benefit[];
  candidatures: Candidature[];
  requirements: Requirement[];
}

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

const contractTypeLabels = {
  CLT: "CLT",
  PJ: "PJ",
  FREELANCER: "Freelancer",
} as const;

const workModalityLabels = {
  REMOTE: "Remoto",
  HYBRID: "Híbrido",
  ON_SITE: "Presencial",
} as const;

const priorityLabels = {
  HIGH: "Alta",
  MEDIUM: "Média",
  LOW: "Baixa",
} as const;

export function CompanyJobs() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [viewJob, setViewJob] = useState<Job | null>(null);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [deleteJob, setDeleteJob] = useState<Job | null>(null);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, setValue, control, watch } =
    useForm<Job>({
      defaultValues: {
        requirements: [],
      },
    });

  // React Hook Form Field Array for requirements
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "requirements",
  });

  // When editJob changes, reset form values including requirements
  useEffect(() => {
    if (editJob) {
      reset(editJob);
    } else {
      reset({ requirements: [] });
    }
  }, [editJob, reset]);

  const { mutate: updateJob, isLoading: isUpdating } = useMutation({
    mutationFn: (data: Partial<Job>) => jobApi.updateJob(editJob!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyJobs", companyId] });
      toast.success("Vaga atualizada com sucesso");
      setEditJob(null);
    },
    onError: () => {
      toast.error("Erro ao atualizar vaga");
    },
  });

  const { mutate: deleteJobMutation, isLoading: isDeleting } = useMutation({
    mutationFn: (jobId: string) => jobApi.deleteJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyJobs", companyId] });
      toast.success("Vaga removida com sucesso");
      setDeleteJob(null);
      setEditJob(null);
      setViewJob(null);
    },
    onError: () => {
      toast.error("Erro ao remover vaga");
    },
  });

  const onEditSubmit = (data: Partial<Job>) => {
    const payload = {
      ...data,
      workModality: data.workModality as WorkModality | undefined,
      contractType: data.contractType as ContractType | undefined,
      requirements: data.requirements || [],
    } as Partial<Job>;
    updateJob(payload);
  };

  const { data: jobs, isLoading } = useQuery<PaginatedResponse<Job>>({
    queryKey: ["companyJobs", companyId],
    queryFn: async () => {
      const response = await api.get(`/admin/jobs/${companyId}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <DefaultLayout leftSideBar={<Menu />}>
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950 py-10">
          <div className="container mx-auto px-4">
            <div className="space-y-4">
              <Skeleton className="h-8 w-[200px]" />
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 py-4">
                    <Skeleton className="h-6 w-[200px]" />
                    <Skeleton className="h-6 w-[100px]" />
                    <Skeleton className="h-6 w-[100px]" />
                    <Skeleton className="h-6 w-[100px]" />
                    <Skeleton className="h-6 w-[100px]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout leftSideBar={<Menu />}>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950 py-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Vagas da Empresa</h1>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-lg">
                {jobs?.totalElements || 0} Vagas anúnciadas
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs?.content.map((job) => (
              <Card
                key={job.id}
                className="p-0 flex flex-col justify-between overflow-hidden"
              >
                <div className="space-y-4 p-6 pb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Publicada por {job.recruiter.firstName}{" "}
                      {job.recruiter.lastName}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-blue-600 text-white">
                      {contractTypeLabels[
                        job.contractType as keyof typeof contractTypeLabels
                      ] || job.contractType}
                    </Badge>
                    <Badge className="bg-indigo-600 text-white">
                      {workModalityLabels[
                        job.workModality as keyof typeof workModalityLabels
                      ] || job.workModality}
                    </Badge>
                    <Badge
                      className={
                        job.priority === "HIGH"
                          ? "bg-red-600 text-white"
                          : job.priority === "MEDIUM"
                          ? "bg-orange-500 text-white"
                          : "bg-blue-500 text-white"
                      }
                    >
                      {priorityLabels[
                        job.priority as keyof typeof priorityLabels
                      ] || job.priority}
                    </Badge>
                    <Badge
                      className={
                        job.status === 1
                          ? "bg-green-600 text-white"
                          : "bg-gray-400 text-white"
                      }
                    >
                      {job.status === 1 ? "Ativa" : "Inativa"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {job.description}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Expira em:{" "}
                    {format(
                      new Date(job.expirationDate),
                      "dd 'de' MMMM 'de' yyyy",
                      {
                        locale: ptBR,
                      }
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigate(
                          `/admin/jobs/${companyId}/${job.id}/candidates`
                        );
                      }}
                      title="Visualizar detalhes"
                    >
                      {job.candidatures?.length || 0} candidaturas
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end gap-2 p-3 border-t border-gray-100 dark:border-gray-700">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewJob(job)}
                    title="Visualizar detalhes"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditJob(job)}
                    title="Editar vaga"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteJob(job)}
                    title="Remover vaga"
                    className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Visualizar detalhes da vaga */}
          <Dialog open={!!viewJob} onOpenChange={() => setViewJob(null)}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Detalhes da Vaga</DialogTitle>
                <DialogDescription>
                  {viewJob && (
                    <>
                      <p className="mb-4">{viewJob.description}</p>
                      <div className="mb-4">
                        <strong>Contrato:</strong>{" "}
                        {contractTypeLabels[
                          viewJob.contractType as keyof typeof contractTypeLabels
                        ] || viewJob.contractType}
                      </div>
                      <div className="mb-4">
                        <strong>Modalidade:</strong>{" "}
                        {workModalityLabels[
                          viewJob.workModality as keyof typeof workModalityLabels
                        ] || viewJob.workModality}
                      </div>
                      <div className="mb-4">
                        <strong>Requisitos:</strong>
                        <ul className="list-disc list-inside">
                          {viewJob.requirements.map((req, idx) => (
                            <li key={idx}>
                              {req.name} - {req.experienceYears} anos de
                              experiência
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mb-4">
                        <strong>Benefícios:</strong>{" "}
                        {viewJob.benefits.map((b, idx) => (
                          <Badge key={idx} className="mr-1">
                            {b.name}
                          </Badge>
                        ))}
                      </div>
                      <div>
                        <strong>Candidaturas:</strong>{" "}
                        {viewJob.candidatures.length}
                      </div>
                    </>
                  )}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={() => setViewJob(null)}>Fechar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Editar vaga */}
          <Dialog open={!!editJob} onOpenChange={() => setEditJob(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Vaga</DialogTitle>
                <DialogDescription>
                  Edite os detalhes da vaga abaixo e clique em salvar.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-6">
                <div>
                  <label className="block mb-1 font-semibold">Título</label>
                  <Input {...register("title", { required: true })} />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Descrição</label>
                  <Textarea {...register("description", { required: true })} />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">
                    Salário (R$)
                  </label>
                  <Input
                    type="number"
                    {...register("salary", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">
                    Data de Expiração
                  </label>
                  <Input type="date" {...register("expirationDate")} />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">
                    Tipo de Contrato
                  </label>
                  <Select
                    onValueChange={(value) => setValue("contractType", value)}
                    value={watch("contractType")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de contrato" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(contractTypeLabels).map(
                        ([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-1 font-semibold">
                    Modalidade de Trabalho
                  </label>
                  <Select
                    onValueChange={(value) => setValue("workModality", value)}
                    value={watch("workModality")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a modalidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(workModalityLabels).map(
                        ([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* REQUISITOS */}
                <div>
                  <label className="block mb-2 font-semibold">Requisitos</label>
                  {fields.length === 0 && (
                    <p className="mb-2 text-sm text-gray-500">
                      Nenhum requisito adicionado.
                    </p>
                  )}
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex gap-2 mb-3 items-center"
                    >
                      <Input
                        placeholder="Nome do requisito"
                        {...register(`requirements.${index}.name` as const, {
                          required: "Nome obrigatório",
                        })}
                      />
                      <Input
                        type="number"
                        min={0}
                        placeholder="Anos de experiência"
                        {...register(
                          `requirements.${index}.experienceYears` as const,
                          {
                            required: "Informe os anos de experiência",
                            valueAsNumber: true,
                            min: { value: 0, message: "Valor mínimo 0" },
                          }
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => remove(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => append({ name: "", experienceYears: 0 })}
                  >
                    Adicionar requisito
                  </Button>
                </div>

                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="flex items-center gap-2"
                  >
                    {isUpdating && <Loader2 className="animate-spin" />}
                    Salvar alterações
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditJob(null)}
                  >
                    Cancelar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Confirmar exclusão */}
          <Dialog open={!!deleteJob} onOpenChange={() => setDeleteJob(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Remover vaga</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja remover a vaga{" "}
                  <strong>{deleteJob?.title}</strong>?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={() => deleteJobMutation(deleteJob!.id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Remover"
                  )}
                </Button>
                <Button onClick={() => setDeleteJob(null)} variant="outline">
                  Cancelar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </DefaultLayout>
  );
}
