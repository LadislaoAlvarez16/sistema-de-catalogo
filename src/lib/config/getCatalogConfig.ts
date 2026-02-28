import { supabase } from "@/lib/supabase/client";
import type { Account } from "@/types/account";

export async function getCatalogConfig(accountId: string): Promise<Account | null> {
    const { data, error } = await supabase
        .from("accounts")
        .select("id, name, plan")
        .eq("id", accountId)
        .maybeSingle<Account>();

    if (error || !data) {
        return null;
    }

    return data;
}
