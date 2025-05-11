import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, PenSquare, Users, Trash2, Clock } from 'lucide-react';
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { Menu } from '@/components/Menu/Menu';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '@/contexts/UserContext';
import { formatCurrency } from '@/utils/format';

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
import { ContractType, Job, jobApi, WorkModality } from '@/services/job';

const workModalityColors: Record<WorkModality, string> = {
  REMOTE: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  HYBRID: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  ON_SITE: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
} as const;

const contractTypeColors: Record<ContractType, string> = {
  CLT: 'bg-teal-100 text-teal-800',
  PJ: 'bg-orange-100 text-orange-800',
  FREELANCER: 'bg-violet-100 text-violet-800',
} as const;

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

interface JobFormData {
  title: string;
  description: string;
  workLocation: string;
  workModality: WorkModality;
  contractType: ContractType;
  salary: number;
  minWeekHours: number;
  maxWeekHours: number;
  expirationDate: string;
}

export function JobAnnouncements() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { userData, simpleUserJson, isAuthorized } = useUserContext();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<JobFormData>();

  useEffect(() => {
    if (!isAuthorized(["RECRUITER", "ADMINISTRATOR"])) {
      navigate('/');
    }
  }, [isAuthorized, navigate]);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['recruiter-jobs', userData?.recruiterId],
    queryFn: () => jobApi.getRecruiterJobs(userData!.recruiterId),
    enabled: !!userData?.recruiterId,
  });

  const { data: selectedJob, isLoading: isLoadingJobDetails } = useQuery({
    queryKey: ['job-details', selectedJobId],
    queryFn: () => jobApi.getJobDetails(selectedJobId!),
    enabled: !!selectedJobId
  });

  useEffect(() => {
    if (selectedJob) {
      Object.entries(selectedJob).forEach(([key, value]) => {
        if (key in selectedJob) {
          setValue(key as keyof JobFormData, value);
        }
      });
    }
  }, [selectedJob, setValue]);

  const updateJobMutation = useMutation({
    mutationFn: (data: JobFormData) => jobApi.updateJob(selectedJobId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job-details'] });
      toast.success('Vaga atualizada com sucesso');
      setSelectedJobId(null);
    },
    onError: () => {
      toast.error('Erro ao atualizar vaga');
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: (jobId: string) => jobApi.deleteJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter-jobs'] });
      toast.success('Vaga removida com sucesso');
    },
    onError: () => {
      toast.error('Erro ao remover vaga');
    },
  });

  const onSubmit = (data: JobFormData) => {
    updateJobMutation.mutate(data);
  };

  if (!simpleUserJson || (simpleUserJson.role !== 'RECRUITER' && simpleUserJson.role !== 'ADMINISTRATOR')) {
    return null;
  }

  if (isLoading || !userData) {
    return (
      <DefaultLayout leftSideBar={<Menu />}>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout leftSideBar={<Menu />}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Minhas Vagas Anunciadas</h1>
          <Button onClick={() => navigate('/jobs/new')}>
            Nova Vaga
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {jobs?.content.map((job: Job) => (
            <Card key={job.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{job.workLocation}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      variant="secondary"
                      className={workModalityColors[job.workModality]}
                    >
                      {job.workModality === 'REMOTE' ? 'Remoto' : 
                       job.workModality === 'HYBRID' ? 'Híbrido' : 'Presencial'}
                    </Badge>
                    <Badge 
                      variant="secondary"
                      className={contractTypeColors[job.contractType]}
                    >
                      {job.contractType}
                    </Badge>
                    <Badge 
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-800"
                    >
                      {formatCurrency(job.salary)}
                    </Badge>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Aceita candidatos até: {formatDate(job.expirationDate)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 p-4">
                <div className="flex items-center justify-between w-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-blue-600"
                    onClick={() => setSelectedJobId(job.id)}
                  >
                    <PenSquare className="h-4 w-4" />
                    <span className="ml-2">Editar</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-purple-600"
                    onClick={() => navigate(`/jobs/${job.id}/candidates`)}
                  >
                    <Users className="h-4 w-4" />
                    <span className="ml-2">Candidatos</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-red-600"
                    onClick={() => deleteJobMutation.mutate(job.id)}
                    disabled={deleteJobMutation.isPending}
                  >
                    {deleteJobMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    <span className="ml-2">Remover</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Dialog 
          open={!!selectedJobId} 
          onOpenChange={(open) => {
            if (!open) {
              setSelectedJobId(null);
              reset();
            }
          }}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar Vaga</DialogTitle>
              <DialogDescription>
                Atualize as informações da vaga
              </DialogDescription>
            </DialogHeader>

            {isLoadingJobDetails ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : selectedJob ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                        defaultValue={selectedJob.workModality}
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
                        defaultValue={selectedJob.contractType}
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
                    onClick={() => {
                      setSelectedJobId(null);
                      reset();
                    }}
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
      </div>
    </DefaultLayout>
  );
} 