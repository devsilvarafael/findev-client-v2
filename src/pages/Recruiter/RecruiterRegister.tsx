"use client";

import { RegisterForm } from "@/components/Forms/RegisterForm";
import { RegisterLayout } from "@/layouts/RegisterLayout";
import { recruiterFields } from "./recruiterFields";
import { TabsForm } from "@/components/Forms/Tabs";
import { CurrentFormProvider } from "@/contexts/CurrentFormContext";
import api from "@/services/api";
import { toast } from "sonner";

import { useEffect, useState } from "react";
import { ICompanyProps } from "@/types/Company";


export const RecruiterRegister = () => {

  const [availableCompanies, setAvailableCompanies] = useState([]);

  const fetchCompanies = async (): Promise<ICompanyProps> => {
    try {
      const response = await api.get("/companies");

      setAvailableCompanies(response.data.content);
      return response.data;
    } catch (error) {
      toast.error("Erro ao buscar empresas");
      throw error;
    }
  };

  const submitRecruiterData = async (data: any) => {
    try {
      const formattedRecruiterJson = {
        ...data,
        company: data.company.value,
      };

      const response = await api.post("/recruiters", formattedRecruiterJson);

      if (response.status === 201) {
        toast.success("Cadastro realizado com sucesso");

        setTimeout(() => {
          window.location.href = "/";
        }, 2000);

        return;
      }
    } catch (error) {
      toast.error("Erro ao realizar cadastro");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  console.log(availableCompanies);

  const recruiterFieldsWithCompanies = {
    account: recruiterFields.account,
    company: [
      {
        name: "company",
        placeholder: "Selecione sua empresa",
        type: "select",
        label: "Empresa",
        required: true,
        items: availableCompanies.map((company: ICompanyProps) => ({
          value: company.companyId,
          label: company.name,
        })),
      },
    ],
  };

  return (
    <CurrentFormProvider>
      <RegisterLayout description="As pessoas certas para a sua empresa.">
        <TabsForm
          forms={[
            <RegisterForm
              formFields={recruiterFieldsWithCompanies.account}
              onSubmit={submitRecruiterData}
            />,
            <RegisterForm
              formFields={recruiterFieldsWithCompanies.company}
              onSubmit={submitRecruiterData}
            />,
          ]}
          tabs={[
            { name: "Conta", id: 0 },
            {
              name: "Empresa",
              id: 1,
            },
          ]}
        />
      </RegisterLayout>
    </CurrentFormProvider>
  );
}
