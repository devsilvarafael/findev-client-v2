import { useState } from "react";
import { DefaultLayout } from "@/layouts/DefaultLayout";
import { Menu } from "@/components/Menu/Menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Globe2, Building2, SignalHigh } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { ContractType, WorkModality, jobApi } from "@/services/job";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useUserContext } from "@/contexts/UserContext";

type Priority = 0 | 1 | 2;

const priorityOptions = {
  0: "Alta",
  1: "Média",
  2: "Baixa"
} as const;

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
  status: number;
  priority: Priority;
  companyId: string;
  recruiterId: string;
  requirements: Array<{
    name: string;
    experienceYears: number;
  }>;
}

export function NewJob() {
  const navigate = useNavigate();
  const { userData } = useUserContext();
  const { register, handleSubmit, setValue } = useForm<JobFormData>();
  const [selectedSkills, setSelectedSkills] = useState<Array<{
    name: string;
    experienceYears: number;
  }>>([]);
  const [newSkill, setNewSkill] = useState("");

  const createJobMutation = useMutation({
    mutationFn: (data: JobFormData) => {
      if (!userData?.companyId || !userData?.recruiterId) {
        throw new Error("Dados do recrutador não encontrados");
      }
      
      if (typeof userData.companyId !== 'string' || typeof userData.recruiterId !== 'string') {
        throw new Error("Dados do recrutador inválidos");
      }

      return jobApi.createJob({
        ...data,
        status: 1,
        companyId: userData.companyId,
        recruiterId: userData.recruiterId,
        expirationDate: new Date(data.expirationDate).toISOString(),
      });
    },
    onSuccess: () => {
      toast.success("Vaga criada com sucesso!");
      navigate("/jobs/announces");
    },
    onError: () => {
      toast.error("Erro ao criar vaga");
    },
  });

  const onSubmit = handleSubmit((data) => {
    const formData = {
      ...data,
      requirements: selectedSkills
    };
    createJobMutation.mutate(formData);
  });

  const handleSkillAdd = () => {
    if (newSkill && !selectedSkills.some(s => s.name === newSkill)) {
      setSelectedSkills([...selectedSkills, {
        name: newSkill,
        experienceYears: 0
      }]);
      setNewSkill("");
    }
  };

  const handleSkillRemove = (skillToRemove: { name: string; experienceYears: number }) => {
    setSelectedSkills(selectedSkills.filter((s) => s.name !== skillToRemove.name));
  };

  const handleExperienceChange = (skillName: string, years: number) => {
    setSelectedSkills(selectedSkills.map(skill => 
      skill.name === skillName ? { ...skill, experienceYears: years } : skill
    ));
  };

  const [workModality, setWorkModality] = useState<{
    remote: boolean;
    hybrid: boolean;
    onSite: boolean;
  }>({
    remote: false,
    hybrid: false,
    onSite: false,
  });

  const handleWorkModalityChange = (type: 'remote' | 'hybrid' | 'onSite', checked: boolean) => {
    if (checked) {
      setWorkModality({
        remote: type === 'remote',
        hybrid: type === 'hybrid',
        onSite: type === 'onSite',
      });
      setValue("workModality", 
        type === 'remote' ? "REMOTE" : 
        type === 'hybrid' ? "HYBRID" : 
        "ON_SITE"
      );
    }
  };

  return (
    <DefaultLayout leftSideBar={<Menu />}>
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Especificações da Vaga</h2>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Contrato</label>
                <Select onValueChange={(value) => setValue("contractType", value as ContractType)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tipo de contrato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLT">CLT</SelectItem>
                    <SelectItem value="PJ">PJ</SelectItem>
                    <SelectItem value="FREELANCER">Freelancer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Título da Vaga</label>
                <Input placeholder="Digite aqui o título da vaga..." {...register("title")} />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Prioridade de Contratação</label>
                <Select onValueChange={(value) => setValue("priority", parseInt(value) as Priority)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">
                      <span className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          {priorityOptions[0]}
                        </Badge>
                      </span>
                    </SelectItem>
                    <SelectItem value="1">
                      <span className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          {priorityOptions[1]}
                        </Badge>
                      </span>
                    </SelectItem>
                    <SelectItem value="2">
                      <span className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {priorityOptions[2]}
                        </Badge>
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Data Expiração</label>
              <Input type="date" placeholder="DD/MM/YYYY" {...register("expirationDate")} />
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe2 className="h-5 w-5 text-gray-500" />
                    <div>
                      <h3 className="font-medium">Remoto</h3>
                      <p className="text-sm text-gray-500">Candidatos podem trabalhar de qualquer lugar.</p>
                    </div>
                  </div>
                  <Switch
                    checked={workModality.remote}
                    onCheckedChange={(checked) => handleWorkModalityChange('remote', checked)}
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <SignalHigh className="h-5 w-5 text-gray-500" />
                    <div>
                      <h3 className="font-medium">Híbrido</h3>
                      <p className="text-sm text-gray-500">Candidatos trabalham parcialmente remoto e presencial.</p>
                    </div>
                  </div>
                  <Switch
                    checked={workModality.hybrid}
                    onCheckedChange={(checked) => handleWorkModalityChange('hybrid', checked)}
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-gray-500" />
                    <div>
                      <h3 className="font-medium">Presencial</h3>
                      <p className="text-sm text-gray-500">Candidatos precisam ir até o escritório diariamente.</p>
                    </div>
                  </div>
                  <Switch
                    checked={workModality.onSite}
                    onCheckedChange={(checked) => handleWorkModalityChange('onSite', checked)}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Salário (Min-Max)</label>
                <div className="flex items-center">
                  <Input
                    type="number"
                    placeholder="3500.00"
                    {...register("salary")}
                    className="rounded-r-none"
                  />
                  <div className="bg-gray-100 px-3 py-2 border border-l-0 border-input rounded-r-md">
                    R$
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Horas Semanais</label>
                  <Input type="number" placeholder="Min." {...register("minWeekHours")} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">&nbsp;</label>
                  <Input type="number" placeholder="Max." {...register("maxWeekHours")} />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Localização</label>
              <div className="flex gap-2">
                <Input {...register("workLocation")} placeholder="Ex: Franca, São Paulo" />
                <Button variant="outline" type="button">
                  Adicionar localização
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Requisitos / Tempo de Experiência</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedSkills.map((skill) => (
                  <div key={skill.name} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                    <Badge variant="secondary" className="py-1 px-2">
                      {skill.name}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        value={skill.experienceYears}
                        onChange={(e) => handleExperienceChange(skill.name, parseInt(e.target.value) || 0)}
                        className="w-20 h-8"
                        placeholder="Anos"
                      />
                      <button
                        onClick={() => handleSkillRemove(skill)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Ex: React, TypeScript, CSS"
                />
                <Button type="button" onClick={handleSkillAdd}>
                  Adicionar
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Descrição</label>
              <Textarea
                {...register("description")}
                placeholder="Descreva os detalhes da vaga..."
                className="min-h-[150px]"
              />
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="w-full"
                disabled={createJobMutation.isPending}
              >
                {createJobMutation.isPending ? "Criando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
} 