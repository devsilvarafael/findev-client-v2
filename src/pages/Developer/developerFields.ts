import { technologyOptions } from "@/pages/Developer/technologyOptions";


export const developerFields = {
  account: [
    {
      name: "firstName",
      label: "Primeiro nome",
      type: "text",
      placeholder: "Digite seu nome de usuário",
      required: true, // Added required property
    },
    {
      name: "lastName",
      label: "Último nome",
      type: "text",
      placeholder: "Digite seu sobrenome",
      required: true, // Added required property
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Digite seu email",
      required: true, // Added required property
    },
    {
      name: "phone",
      label: "Telefone",
      type: "text",
      placeholder: "Insira seu número de contato",
      required: true, // Added required property
    },
    {
      name: "password",
      label: "Senha",
      type: "password",
      placeholder: "Digite sua senha",
      required: true, // Added required property
    },
  ],
  skills: [
    {
      name: "portfolio",
      label: "Portfolio",
      type: "text",
      placeholder: "Digite seu portfolio",
      required: false,
    },
    {
      name: "skills",
      label: "Skills",
      type: "select",
      placeholder: "Selecione suas skills",
      items: technologyOptions,
      required: true,
    },
    {
      name: "seniority",
      label: "Senioridade",
      type: "select",
      placeholder: "Selecione sua senioridade",
      items: [
        { value: 0, label: "Junior" },
        { value: 1, label: "Pleno" },
        { value: 2, label: "Senior" },
        { value: 3, label: "Especialista" },
      ],
      required: true,
    },
  ],
};
