import { Fragment, useState, useEffect, ReactNode } from "react";
import { useCurrentForm } from "@/contexts/CurrentFormContext";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { Link } from "react-router-dom";
import { TechnologyMultiSelect } from "@/pages/Developer/components/select-skills";

export interface FormField {
  name: string;
  placeholder: string;
  type: string;
  label: string;
  items?: {
    value: string | number;
    label: string;
    id?: number;
  }[];
  required?: boolean;
  experienceField?: {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    min: number;
    max: number;
  };
}

interface RegisterFormProps {
  formFields: FormField[];
  onSubmit: (data: Record<string, unknown>) => void;
  children?: ReactNode;
}

export const RegisterForm = ({
  formFields,
  onSubmit,
  children
}: RegisterFormProps) => {
  const { currentFormId, updateFormData, formData, updateCurrentForm } =
    useCurrentForm();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: formData,
  });
  const [isSubmitting] = useState(false);

  useEffect(() => {
    updateFormData(getValues());
  }, [getValues, updateFormData]);

  const handleNext = (data: Record<string, unknown>) => {
    if (currentFormId < 1) {
      updateCurrentForm(currentFormId + 1);
    } else {
      onSubmit(data);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 min-w-[500px] bg-gray-50">
      <div className="flex flex-col w-full h-full p-8 space-y-6 bg-white shadow-lg rounded-lg max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Quase lá!
        </h2>
        <form
          onSubmit={handleSubmit(handleNext)}
          className="flex flex-col gap-4"
        >
          {formFields.map((field: FormField) => (
            <Fragment key={field.name}>
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              
              {field.type === "select" && field.name === "skills" ? (
                <TechnologyMultiSelect 
                  field={field} 
                  control={control} 
                  name={field.name} 
                />
              ) : field.type === "select" ? (
                <Controller
                  control={control}
                  name={field.name}
                  rules={{ required: field.required }}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      options={field.items}
                      onChange={(selectedOption) => onChange(selectedOption)}
                      placeholder={field.placeholder}
                      value={value}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  )}
                />
              ) : (
                <input
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                  type={field.type}
                  {...register(field.name, { required: field.required })}
                  placeholder={field.placeholder}
                />
              )}
              {errors[field.name] && (
                <span className="text-red-800 text-sm">{`${field.label} é obrigatório`}</span>
              )}
            </Fragment>
          ))}
          {children}
          <button
            className={`w-full px-4 py-2 mt-4 text-white ${
              !isSubmitting ? "bg-purple-600" : "bg-gray-300"
            } rounded-md ${
              !isSubmitting ? "hover:bg-purple-700" : ""
            } focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Enviando dados..."
              : currentFormId === 1
                ? "Cadastrar"
                : "Próximo"}
          </button>

          <p className="text-sm text-center text-gray-600">
            Já possuí uma conta?{" "}
            <Link to="/" className="text-purple-600 underline">
              Faça login!
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};