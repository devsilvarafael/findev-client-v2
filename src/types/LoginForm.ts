import { ChangeEvent, FormEvent } from "react";
import { User } from "./User";

export interface LoginFormProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  user: User;
}
