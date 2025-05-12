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
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import { jobApi, ContractType, WorkModality } from '@/services/job';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Benefit {
  // Define according to your backend, for now just a placeholder
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
  requirements: { name: string; experienceYears: number }[];
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
  FREELANCER: "Freelancer"
} as const;

const workModalityLabels = {
  REMOTE: "Remoto",
  HYBRID: "Híbrido",
  ON_SITE: "Presencial"
} as const;

const priorityLabels = {
  HIGH: "Alta",
  MEDIUM: "Média",
  LOW: "Baixa"
} as const;

export function CompanyJobs() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [viewJob, setViewJob] = useState<Job | null>(null);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [deleteJob, setDeleteJob] = useState<Job | null>(null);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, setValue } = useForm<Job>({});

  useEffect(() => {
    if (editJob) {
      Object.entries(editJob).forEach(([key, value]) => {
        setValue(key as keyof Job, value);
      });
    } else {
      reset();
    }
  }, [editJob, setValue, reset]);

  const updateJobMutation = useMutation({
    mutationFn: (data: Partial<Job>) => jobApi.updateJob(editJob!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyJobs", companyId] });
      toast.success('Vaga atualizada com sucesso');
      setEditJob(null);
    },
    onError: () => {
      toast.error('Erro ao atualizar vaga');
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: (jobId: string) => jobApi.deleteJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyJobs", companyId] });
      toast.success('Vaga removida com sucesso');
      setDeleteJob(null);
      setEditJob(null);
      setViewJob(null);
    },
    onError: () => {
      toast.error('Erro ao remover vaga');
    },
  });

  const onEditSubmit = (data: Partial<Job>) => {
    const payload = {
      ...data,
      workModality: data.workModality as WorkModality | undefined,
      contractType: data.contractType as ContractType | undefined,
    } as Partial<Job>;
    updateJobMutation.mutate(payload);
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
              <Card key={job.id} className="p-0 flex flex-col justify-between overflow-hidden">
                <div className="space-y-4 p-6 pb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Publicada por {job.recruiter.firstName} {job.recruiter.lastName}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-blue-600 text-white">
                      {contractTypeLabels[job.contractType as keyof typeof contractTypeLabels] || job.contractType}
                    </Badge>
                    <Badge className="bg-indigo-600 text-white">
                      {workModalityLabels[job.workModality as keyof typeof workModalityLabels] || job.workModality}
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
                      {priorityLabels[job.priority as keyof typeof priorityLabels] || job.priority}
                    </Badge>
                    <Badge
                      className={
                        job.status === 1
                          ? "bg-green-600 text-white"
                          : job.status === 0
                          ? "bg-gray-500 text-white"
                          : "bg-red-600 text-white"
                      }
                    >
                      {job.status === 1 ? "Ativa" : job.status === 0 ? "Rascunho" : "Fechada"}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <span>Salário: <span className="font-medium text-gray-900 dark:text-gray-100">R$ {job.salary.toLocaleString("pt-BR")}</span></span>
                    <span>Expira em: {format(new Date(job.expirationDate), "dd/MM/yyyy", { locale: ptBR })}</span>
                    <span>{job.candidatures.length} candidaturas</span>
                  </div>
                </div>
                <div className="border-t bg-gray-50 dark:bg-gray-800 p-4 grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-gray-300 text-gray-600 bg-white hover:bg-blue-600 hover:text-white justify-center"
                    onClick={() => setViewJob(job)}
                  >
                    <Eye className="h-4 w-4 mr-2" /> Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1  bg-white hover:bg-orange-500 hover:text-white justify-center"
                    onClick={() => setEditJob(job)}
                  >
                    <Pencil className="h-4 w-4 mr-2" /> Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1  bg-white hover:bg-red-600 hover:text-white justify-center"
                    onClick={() => setDeleteJob(job)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Excluir
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Job Details Dialog */}
          <Dialog open={!!viewJob} onOpenChange={(open) => !open && setViewJob(null)}>
            <DialogContent className="max-w-2xl">
              {viewJob && (
                <>
                  <DialogHeader>
                    <DialogTitle>{viewJob.title}</DialogTitle>
                    <DialogDescription>
                      {viewJob.company.name} • {viewJob.workLocation}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-600 text-white">
                        {contractTypeLabels[viewJob.contractType as keyof typeof contractTypeLabels] || viewJob.contractType}
                      </Badge>
                      <Badge className="bg-indigo-600 text-white">
                        {workModalityLabels[viewJob.workModality as keyof typeof workModalityLabels] || viewJob.workModality}
                      </Badge>
                      <Badge className={viewJob.priority === "HIGH" ? "bg-red-600 text-white" : viewJob.priority === "MEDIUM" ? "bg-orange-500 text-white" : "bg-blue-500 text-white"}>
                        {priorityLabels[viewJob.priority as keyof typeof priorityLabels] || viewJob.priority}
                      </Badge>
                      <Badge className={viewJob.status === 1 ? "bg-green-600 text-white" : viewJob.status === 0 ? "bg-gray-500 text-white" : "bg-red-600 text-white"}>
                        {viewJob.status === 1 ? "Ativa" : viewJob.status === 0 ? "Rascunho" : "Fechada"}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <div><span className="font-medium text-gray-900 dark:text-gray-100">Salário:</span> R$ {viewJob.salary.toLocaleString("pt-BR")}</div>
                      <div><span className="font-medium text-gray-900 dark:text-gray-100">Expira em:</span> {format(new Date(viewJob.expirationDate), "dd/MM/yyyy", { locale: ptBR })}</div>
                      <div><span className="font-medium text-gray-900 dark:text-gray-100">Publicado em:</span> {format(new Date(viewJob.createdAt), "dd/MM/yyyy", { locale: ptBR })}</div>
                      <div><span className="font-medium text-gray-900 dark:text-gray-100">Local:</span> {viewJob.workLocation}</div>
                      <div><span className="font-medium text-gray-900 dark:text-gray-100">Descrição:</span> {viewJob.description}</div>
                    </div>
                    <div className="mt-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100">Requisitos:</span>
                      <ul className="list-disc ml-6">
                        {viewJob.requirements.map((req, idx) => (
                          <li key={idx}>{req.name} ({req.experienceYears} anos)</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                      onClick={() => {
                        setViewJob(null);
                        navigate(`/admin/jobs/${companyId}/${viewJob.id}/candidates`);
                      }}
                    >
                      Ver Candidatos
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* Edit Job Dialog */}
          <Dialog open={!!editJob} onOpenChange={(open) => { if (!open) { setEditJob(null); reset(); } }}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Editar Vaga</DialogTitle>
                <DialogDescription>Atualize as informações da vaga</DialogDescription>
              </DialogHeader>
              {editJob ? (
                <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Título</label>
                      <Input {...register('title')} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Descrição</label>
                      <Textarea {...register('description')} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Localização</label>
                      <Input {...register('workLocation')} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Modalidade</label>
                        <Select 
                          onValueChange={(value) => setValue('workModality', value as WorkModality)}
                          value={editJob.workModality as WorkModality}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="REMOTE">Remoto</SelectItem>
                            <SelectItem value="HYBRID">Híbrido</SelectItem>
                            <SelectItem value="ON_SITE">Presencial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Tipo de Contrato</label>
                        <Select 
                          onValueChange={(value) => setValue('contractType', value as ContractType)}
                          value={editJob.contractType as ContractType}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CLT">CLT</SelectItem>
                            <SelectItem value="PJ">PJ</SelectItem>
                            <SelectItem value="FREELANCER">Freelancer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Salário</label>
                      <Input type="number" {...register('salary')} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Horas Semanais (Mín.)</label>
                        <Input type="number" {...register('minWeekHours')} />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Horas Semanais (Máx.)</label>
                        <Input type="number" {...register('maxWeekHours')} />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Data de Expiração</label>
                      <Input type="date" {...register('expirationDate')} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => { setEditJob(null); reset(); }}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit"
                      disabled={updateJobMutation.isPending}
                    >
                      {updateJobMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Salvando...
                        </>
                      ) : (
                        'Salvar Alterações'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              ) : null}
            </DialogContent>
          </Dialog>

          {/* Delete Job Dialog */}
          <Dialog open={!!deleteJob} onOpenChange={(open) => { if (!open) setDeleteJob(null); }}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Remover Vaga</DialogTitle>
                <DialogDescription>Tem certeza que deseja remover esta vaga?</DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setDeleteJob(null)}>
                  Cancelar
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => deleteJobMutation.mutate(deleteJob!.id)}
                  disabled={deleteJobMutation.isPending}
                >
                  {deleteJobMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Remover
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </DefaultLayout>
  );
} 