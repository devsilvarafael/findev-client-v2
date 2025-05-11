import { Skill } from "./Skill";

export interface Developer {
  developerId: string;
  firstName: string;
  lastName: string;
  email: string;
  skills: Skill[];
}
