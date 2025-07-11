import { Step } from "./steps";

export interface Message {
  id: number;
  message: string;
  role: Role;
  createTime: Date;
}

export enum Role {
  user = "user",
  model = "model",
}

export type DisplayMessage = {
  role: "model" | "user";
  userMessage?: string;
  modelMessage?: Step[];
};
