import { createPublicClient } from "@/lib/supabase/server-public";
import type { Account } from "@/types/account";

export async function getCatalogConfig(accountId: string): Promise<Account | null> {
    const supabase = await createPublicClient();
    const { data, error } = await supabase
        .from("accounts")
        .select("id, name, plan, whatsapp")
        .eq("id", accountId)
        .maybeSingle<Account>();

    if (error || !data) {
        return null;
    }

    return data;
}