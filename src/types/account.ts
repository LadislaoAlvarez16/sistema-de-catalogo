import { Plan } from "./plan";

export type Account = {
    id: string;
    name: string;
    plan: Plan;
    whatsapp?: string | null;
};