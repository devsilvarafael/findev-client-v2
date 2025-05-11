"use client";
import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";

interface CurrentFormContextProps {
  currentFormId: number;
  updateCurrentForm: Dispatch<SetStateAction<number>>;
  formData: { [key: string]: any };
  updateFormData: (data: { [key: string]: any }) => void;
}

export const CurrentFormContext = createContext<CurrentFormContextProps>({
  currentFormId: 0,
  updateCurrentForm: () => {},
  formData: {},
  updateFormData: () => {},
});

export const CurrentFormProvider = ({ children }: { children: ReactNode }) => {
  const [currentFormId, setCurrentFormId] = useState<number>(0);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});

  const updateCurrentForm: Dispatch<SetStateAction<number>> = (formId) => {
    setCurrentFormId(formId);
  };

  const updateFormData = (data: { [key: string]: any }) => {
    setFormData((prevData) => ({ ...prevData, ...data }));
  };

  return (
    <CurrentFormContext.Provider
      value={{ currentFormId, updateCurrentForm, formData, updateFormData }}
    >
      {children}
    </CurrentFormContext.Provider>
  );
};

export const useCurrentForm = () => {
  const context = useContext(CurrentFormContext);

  if (!context) {
    throw new Error("useCurrentForm must be used within a CurrentFormProvider");
  }

  return context;
};
