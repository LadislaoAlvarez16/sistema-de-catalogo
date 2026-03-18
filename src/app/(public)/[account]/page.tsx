import { supabase } from "@/lib/supabase/client";
import type { Product } from "@/types/product";
import ProductGrid from "@/components/catalog/ProductGrid";
import { getCatalogConfig } from "@/lib/config/getCatalogConfig";
import { notFound } from "next/navigation";
import type { Plan } from "@/lib/plan/plan.config";

type PageProps = {
    params: Promise<{ account: string }>;
};

async function getAccountIdBySlug(slug: string): Promise<string | null> {
    const { data, error } = await supabase
        .from("accounts")
        .select("id")
        .eq("slug", slug)
        .maybeSingle<{ id: string }>();

    if (error || !data) return null;
    return data.id;
}

export default async function PublicPage({ params }: PageProps) {
    const { account: accountSlug } = await params;

    const accountId = await getAccountIdBySlug(accountSlug);
    if (!accountId) notFound();

    const config = await getCatalogConfig(accountId);
    if (!config) notFound();

    const { data: products, error: prodError } = await supabase
        .from("products")
        .select(`
            id,
            slug,
            name,
            description,
            price,
            category_id,
            category,
            image_url,
            active,
            created_at
        `)
        .eq("active", true)
        .eq("account_id", accountId)
        .order("created_at", { ascending: false })
        .returns<Product[]>();

    const { data: categories, error: catError } = await supabase
        .from("categories")
        .select("id, name, slug")
        .eq("account_id", accountId)
        .order("name", { ascending: true });

    if (prodError || catError) {
        return (
            <main style={{ padding: 24 }}>
                <h1>Error</h1>
                <pre>{JSON.stringify(prodError || catError, null, 2)}</pre>
            </main>
        );
    }

    return (
        <main>
            <h1>Productos</h1>
            <ProductGrid
                products={products}
                plan={config.plan as Plan}
                categories={categories || []}
                phoneNumber={config.whatsapp || undefined}
            />
        </main>
    );
}