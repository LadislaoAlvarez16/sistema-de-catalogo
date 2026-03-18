export type Account = {
    id: string;
    name: string;
    plan: "basic" | "medium" | "pro";
    whatsapp?: string | null;
};