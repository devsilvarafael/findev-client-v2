/* eslint-disable @typescript-eslint/no-explicit-any */

import { RegisterForm } from "@/components/Forms/RegisterForm";
import { TabsForm } from "@/components/Forms/Tabs";
import { CurrentFormProvider } from "@/contexts/CurrentFormContext";
import { RegisterLayout } from "@/layouts/RegisterLayout";
import { developerFields } from "@/pages/Developer/developerFields";
import api from "@/services/api";
import { toast } from "sonner";

export const RegisterDeveloper = () => {

  const submitDeveloperData = async (data: any) => {
    try {
      const formattedDeveloperJson = {
        ...data,
        seniority: data.seniority.value,
        skills: data.skills.map(
          (skill: { id: number; experienceYears: number }) => ({
            skillId: skill.id,
            experienceYears: skill.experienceYears || 0,
          })
        ),
      };

      console.log(formattedDeveloperJson);

      const response = await api.post("/developers", formattedDeveloperJson);

      if (response.status === 201) {
        toast.success("Cadastro realizado com sucesso");
      }

      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao realizar cadastro");
    }
  };

  return (
    <CurrentFormProvider>
      <RegisterLayout description={"Encontre o emprego que você sonha."}>
        <TabsForm
          forms={[
            <RegisterForm
              formFields={developerFields.account}
              onSubmit={submitDeveloperData}
            />,
            <RegisterForm
              formFields={developerFields.skills}
              onSubmit={submitDeveloperData}
            />,
          ]}
          tabs={[
            { name: "Conta", id: 0 },
            { name: "Skills/Portfolio", id: 1 },
          ]}
        />
      </RegisterLayout>
    </CurrentFormProvider>
  );
};
