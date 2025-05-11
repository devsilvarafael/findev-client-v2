import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJobCandidates, updateCandidatureStatus } from '@/services/jobCandidates';
import { useParams } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Briefcase, Mail, Phone, Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { Menu } from '@/components/Menu/Menu';
import { toast } from 'sonner';
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Candidate, CandidatureStatus } from '@/types/candidate';
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

const translateCandidatureStatus: Record<CandidatureStatus, string> = {
  PENDING_REVIEW: 'Aguardando análise',
  UNDER_REVIEW: 'Em análise',
  INTERVIEW_INVITED: 'Convidado para entrevista',
  INTERVIEW_COMPLETED: 'Entrevista realizada',
  FEEDBACK_PROVIDED: 'Feedback enviado',
  ACCEPTED: 'Aceito',
  REFUSED: 'Recusado',
  WITHDRAWN: 'Candidatura retirada',
  HIRED: 'Contratado'
};

const statusOrder: CandidatureStatus[] = [
  'PENDING_REVIEW',
  'UNDER_REVIEW',
  'INTERVIEW_INVITED',
  'INTERVIEW_COMPLETED',
  'FEEDBACK_PROVIDED',
  'ACCEPTED',
  'REFUSED',
  'WITHDRAWN',
  'HIRED'
];

export function JobCandidates() {
  const queryClient = useQueryClient();
  const { jobId } = useParams<{ jobId: string }>();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const { userData } = useUserContext();

  const { data: candidates, isLoading } = useQuery({
    queryKey: ['job-candidates', jobId],
    queryFn: () => fetchJobCandidates(jobId!),
    enabled: !!jobId && !!userData?.recruiterId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (variables: { candidatureId: string; status: CandidatureStatus }) =>
      updateCandidatureStatus(variables.candidatureId, variables.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-candidates'] });
      toast.success('Status atualizado com sucesso');
      setSelectedCandidate(null);
    },
    onError: () => {
      toast.error('Erro ao atualizar status');
    },
  });

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as CandidatureStatus;

    updateStatusMutation.mutate({
      candidatureId: draggableId,
      status: newStatus,
    });
  };

  if (isLoading || !userData) {
    return (
      <DefaultLayout leftSideBar={<Menu />}>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DefaultLayout>
    );
  }

  const candidatesByStatus = statusOrder.reduce((acc, status) => {
    acc[status] = candidates?.content.filter((candidate: Candidate) => candidate.status === status) || [];
    return acc;
  }, {} as Record<CandidatureStatus, Candidate[]>);

  return (
    <DefaultLayout leftSideBar={<Menu />}>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Candidatos</h1>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-4 gap-4 overflow-x-auto">
            {statusOrder.map((status) => (
              <Droppable key={status} droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <h2 className="text-sm font-medium text-gray-700 mb-4 flex items-center justify-between">
                      {translateCandidatureStatus[status]}
                      <Badge variant="secondary" className={statusColors[status]}>
                        {candidatesByStatus[status].length}
                      </Badge>
                    </h2>

                    <div className="space-y-3">
                      {candidatesByStatus[status].map((candidate, index) => (
                        <Draggable
                          key={candidate.candidatureId}
                          draggableId={candidate.candidatureId}
                          index={index}
                        >
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white cursor-pointer hover:shadow-md transition-shadow"
                              onClick={() => setSelectedCandidate(candidate)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center space-x-4">
                                  <Avatar>
                                    <AvatarImage src={candidate.developer.avatar || undefined} />
                                    <AvatarFallback>
                                      {candidate.developer.firstName.charAt(0)}
                                      {candidate.developer.lastName.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="text-sm font-medium">
                                      {candidate.developer.firstName} {candidate.developer.lastName}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                      {candidate.developer.email}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>

        <Dialog open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
          <DialogContent className="sm:max-w-[600px]">
            {selectedCandidate && (
              <>
                <DialogHeader>
                  <DialogTitle>Detalhes do Candidato</DialogTitle>
                  <DialogDescription>
                    Informações e status da candidatura
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedCandidate.developer.avatar || undefined} />
                      <AvatarFallback className="text-lg">
                        {selectedCandidate.developer.firstName.charAt(0)}
                        {selectedCandidate.developer.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-semibold">
                        {selectedCandidate.developer.firstName} {selectedCandidate.developer.lastName}
                      </h2>
                      <Badge variant="secondary" className={statusColors[selectedCandidate.status]}>
                        {translateCandidatureStatus[selectedCandidate.status]}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{selectedCandidate.developer.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{selectedCandidate.developer.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <a
                        href={selectedCandidate.developer.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Portfolio
                      </a>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      <span>{selectedCandidate.developer.seniority} anos de experiência</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.developer.skills.map((skill) => (
                        <Badge key={skill.skillId} variant="secondary">
                          {skill.skillName} ({skill.experienceYears} anos)
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Atualizar Status</label>
                    <Select
                      value={selectedCandidate.status}
                      onValueChange={(value: CandidatureStatus) => {
                        updateStatusMutation.mutate({
                          candidatureId: selectedCandidate.candidatureId,
                          status: value,
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOrder.map((status) => (
                          <SelectItem key={status} value={status}>
                            {translateCandidatureStatus[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedCandidate(null)}>
                    Fechar
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DefaultLayout>
  );
} 