import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DefaultLayout } from "@/layouts/DefaultLayout";
import { Menu } from "@/components/Menu/Menu";
import api from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface Recruiter {
  recruiterId: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  phone: string;
  companyId: string;
  isActive: boolean;
}

interface Pageable {
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}

interface PaginatedResponse<T> {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

interface EditRecruiterForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface CreateRecruiterForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export function CompanyRecruiters() {
  const { companyId } = useParams();
  const queryClient = useQueryClient();
  const [selectedRecruiter, setSelectedRecruiter] = useState<Recruiter | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: recruiters, isLoading } = useQuery<PaginatedResponse<Recruiter>>({
    queryKey: ["companyRecruiters", companyId],
    queryFn: async () => {
      const response = await api.get(`/admin/recruiters/${companyId}`);
      return response.data;
    },
  });

  const toggleRecruiterStatus = useMutation({
    mutationFn: async ({ recruiter, isActive }: { recruiter: Recruiter; isActive: boolean }) => {
      await api.put(`/auth/${recruiter.recruiterId}?status=${isActive}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyRecruiters", companyId] });
      toast.success("Status do recrutador atualizado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao atualizar status do recrutador");
    },
  });

  const deleteRecruiter = useMutation({
    mutationFn: async (recruiterId: string) => {
      await api.delete(`/recruiters/${recruiterId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyRecruiters", companyId] });
      toast.success("Recrutador removido com sucesso");
    },
    onError: () => {
      toast.error("Erro ao remover recrutador");
    },
  });

  const editRecruiter = useMutation({
    mutationFn: async ({ recruiter, data }: { recruiter: Recruiter; data: EditRecruiterForm }) => {
      await api.put(`/recruiters/${recruiter.recruiterId}`, {
        ...recruiter,
        ...data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyRecruiters", companyId] });
      toast.success("Recrutador atualizado com sucesso");
      setIsEditDialogOpen(false);
    },
    onError: () => {
      toast.error("Erro ao atualizar recrutador");
    },
  });

  const createRecruiter = useMutation({
    mutationFn: async (data: CreateRecruiterForm) => {
      await api.post("/recruiters", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        avatar: null,
        phone: data.phone,
        password: data.password,
        company: companyId,
        isActive: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyRecruiters", companyId] });
      toast.success("Recrutador criado com sucesso");
      setIsCreateDialogOpen(false);
    },
    onError: () => {
      toast.error("Erro ao criar recrutador");
    },
  });

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedRecruiter) return;

    const formData = new FormData(e.currentTarget);
    const data: EditRecruiterForm = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    };

    editRecruiter.mutate({ recruiter: selectedRecruiter, data });
  };

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: CreateRecruiterForm = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      password: formData.get("password") as string,
    };
    createRecruiter.mutate(data);
  };

  if (isLoading) {
    return (
      <DefaultLayout leftSideBar={<Menu />}>
        <div className="container mx-auto py-8 px-4">
          <div className="space-y-4">
            <Skeleton className="h-8 w-[200px]" />
            <div className="border rounded-lg">
              <div className="p-4 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                    <Skeleton className="h-10 w-[100px]" />
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
            <h1 className="text-2xl font-bold">Recrutadores da Empresa</h1>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-lg">
                {recruiters?.totalElements || 0} Recrutadores
              </Badge>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    Novo Recrutador
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Novo Recrutador</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Nome</Label>
                        <Input id="firstName" name="firstName" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Sobrenome</Label>
                        <Input id="lastName" name="lastName" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" name="phone" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input id="password" name="password" type="password" required />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={createRecruiter.isPending}
                      >
                        {createRecruiter.isPending ? "Criando..." : "Criar"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recrutador</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recruiters?.content.map((recruiter) => (
                  <TableRow key={recruiter.recruiterId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={recruiter.avatar || undefined} />
                          <AvatarFallback>
                            {recruiter.firstName[0]}{recruiter.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{recruiter.firstName} {recruiter.lastName}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{recruiter.email}</TableCell>
                    <TableCell>{recruiter.phone}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={recruiter.isActive ? "default" : "secondary"}
                        className={recruiter.isActive ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-gray-100 text-gray-800 hover:bg-gray-100"}
                      >
                        {recruiter.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Dialog open={isEditDialogOpen && selectedRecruiter?.recruiterId === recruiter.recruiterId} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                            onClick={() => setSelectedRecruiter(recruiter)}
                          >
                            Editar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Recrutador</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="firstName">Nome</Label>
                                <Input
                                  id="firstName"
                                  name="firstName"
                                  defaultValue={recruiter.firstName}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="lastName">Sobrenome</Label>
                                <Input
                                  id="lastName"
                                  name="lastName"
                                  defaultValue={recruiter.lastName}
                                  required
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={recruiter.email}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">Telefone</Label>
                              <Input
                                id="phone"
                                name="phone"
                                defaultValue={recruiter.phone}
                                required
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                              >
                                Cancelar
                              </Button>
                              <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700"
                                disabled={editRecruiter.isPending}
                              >
                                {editRecruiter.isPending ? "Salvando..." : "Salvar"}
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        className={
                          recruiter.isActive
                            ? "border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                            : "border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                        }
                        onClick={() =>
                          toggleRecruiterStatus.mutate({
                            recruiter,
                            isActive: !recruiter.isActive,
                          })
                        }
                      >
                        {recruiter.isActive ? "Desativar" : "Ativar"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => deleteRecruiter.mutate(recruiter.recruiterId)}
                      >
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
} 