import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, X, Eye } from 'lucide-react';
import { candidatureApi } from '@/services/candidature';
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { Menu } from '@/components/Menu/Menu';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from 'react';
import { formatCurrency } from '@/utils/format';
import { useUserContext } from '@/contexts/UserContext';

const statusColors = {
  PENDING_REVIEW: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  UNDER_REVIEW: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  INTERVIEW_INVITED: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  INTERVIEW_COMPLETED: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
  FEEDBACK_PROVIDED: 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200',
  ACCEPTED: 'bg-green-100 text-green-800 hover:bg-green-200',
  REFUSED: 'bg-red-100 text-red-800 hover:bg-red-200',
  WITHDRAWN: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  HIRED: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
} as const;

const workModalityColors = {
  REMOTE: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  HYBRID: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  ON_SITE: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
} as const;

const contractTypeColors = {
  CLT: 'bg-teal-100 text-teal-800',
  PJ: 'bg-orange-100 text-orange-800',
  FREELANCER: 'bg-violet-100 text-violet-800',
} as const;

type StatusColor = typeof statusColors;
type Status = keyof StatusColor;

type WorkModalityColor = typeof workModalityColors;
type WorkModality = keyof WorkModalityColor;

type ContractTypeColor = typeof contractTypeColors;
type ContractType = keyof ContractTypeColor;

const skillColors = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-purple-100 text-purple-800',
  'bg-orange-100 text-orange-800',
  'bg-pink-100 text-pink-800',
  'bg-indigo-100 text-indigo-800',
  'bg-teal-100 text-teal-800',
  'bg-red-100 text-red-800',
];

const translateCandidatureStatus = {
  PENDING_REVIEW: 'Aguardando análise',
  UNDER_REVIEW: 'Em análise',
  INTERVIEW_INVITED: 'Convidado para entrevista',
  INTERVIEW_COMPLETED: 'Entrevista realizada',
  FEEDBACK_PROVIDED: 'Feedback enviado',
  ACCEPTED: 'Aceito',
  REFUSED: 'Recusado',
  WITHDRAWN: 'Candidatura retirada',
  HIRED: 'Contratado'
} as const;

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function DeveloperCandidatures() {
  const queryClient = useQueryClient();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const { userData } = useUserContext();

  const { data: candidatures, isLoading, error } = useQuery({
    queryKey: ['candidatures', userData?.developerId],
    queryFn: () => candidatureApi.getDeveloperCandidatures(userData!.developerId as string),
    enabled: !!userData?.developerId,
  });

  const { data: jobDetails, isLoading: isLoadingJobDetails } = useQuery({
    queryKey: ['job', selectedJobId],
    queryFn: () => candidatureApi.getJobDetails(selectedJobId!),
    enabled: !!selectedJobId,
  });

  const unapplyMutation = useMutation({
    mutationFn: ({ jobId }: { jobId: string }) => 
      candidatureApi.unapplyFromJob(jobId, userData!.developerId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidatures'] });
      toast.info("Candidatura retirada com sucesso.");
    },
    onError: () => {
      toast.error("Falha na remoção da candidatura.")
    },
  });

  if (isLoading || !userData) {
    return (
      <DefaultLayout leftSideBar={<Menu />}>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout leftSideBar={<Menu />}>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-red-500">Failed to fetch applications</div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout leftSideBar={<Menu />}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Minhas candidaturas</h1>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {candidatures?.content.map((candidature) => (
            <Card key={candidature.candidatureId} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={candidature.developerDto.avatar || undefined} />
                      <AvatarFallback className="bg-primary/10">
                        {candidature.company.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-2">
                      <h3 className="text-sm font-medium text-gray-900">{candidature.jobDescription}</h3>
                      <p className="text-sm font-medium text-gray-600">{candidature.company.name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge 
                          variant="secondary"
                          className={`text-xs ${statusColors[candidature.status as Status]}`}
                        >
                          {translateCandidatureStatus[candidature.status as Status]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center justify-end w-full space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-blue-600 w-1/2"
                    onClick={() => setSelectedJobId(candidature.jobId)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="ml-2">Detalhes</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-red-600 w-1/2"
                    onClick={() => unapplyMutation.mutate({ jobId: candidature.jobId })}
                    disabled={unapplyMutation.isPending}
                  >
                    {unapplyMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    <span className="ml-2">Retirar</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Dialog open={!!selectedJobId} onOpenChange={() => setSelectedJobId(null)}>
          <DialogContent className="sm:max-w-[600px]">
            {isLoadingJobDetails ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : jobDetails ? (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl">{jobDetails.title}</DialogTitle>
                  <DialogDescription className="flex items-center gap-2">
                    <span>{jobDetails.company.name}</span>
                    <span>•</span>
                    <span>{jobDetails.workLocation}</span>
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      variant="secondary"
                      className={workModalityColors[jobDetails.workModality as WorkModality]}
                    >
                      {jobDetails.workModality === 'REMOTE' ? 'Remoto' : 
                       jobDetails.workModality === 'HYBRID' ? 'Híbrido' : 'Presencial'}
                    </Badge>
                    <Badge 
                      variant="secondary"
                      className={contractTypeColors[jobDetails.contractType as ContractType]}
                    >
                      {jobDetails.contractType}
                    </Badge>
                    <Badge 
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-800"
                    >
                      {formatCurrency(jobDetails.salary)}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Detalhes da vaga</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Carga horária:</span>
                        <p className="font-medium">{jobDetails.minWeekHours}h - {jobDetails.maxWeekHours}h semanais</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Aceita candidaturas até:</span>
                        <p className="font-medium">{formatDate(jobDetails.expirationDate)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Descrição</h4>
                    <p className="text-sm text-gray-500 whitespace-pre-wrap">{jobDetails.description}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Skills & Experiência</h4>
                    <div className="flex flex-wrap gap-2">
                      {jobDetails.requirements.map((skill, index) => (
                        <Badge 
                          key={skill.name} 
                          variant="secondary"
                          className={skillColors[index % skillColors.length]}
                        >
                          {skill.name} ({skill.experienceYears} {skill.experienceYears === 1 ? 'ano' : 'anos'})
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </DefaultLayout>
  );
} 