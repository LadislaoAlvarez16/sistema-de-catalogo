import { supabase } from "@/lib/supabase/client";

export function getProductImageUrl(path: string | null) {
    if (!path) return "/placeholder.png";

    const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(path);

    return data.publicUrl;
}
