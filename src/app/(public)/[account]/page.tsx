import { supabase } from "@/lib/supabase/client";
import type { Product } from "@/types/product";
import ProductGrid from "@/components/catalog/ProductGrid";
import { getCatalogConfig } from "@/lib/config/getCatalogConfig";
import { notFound } from "next/navigation";
import type { Plan } from "@/lib/plan/plan.config"; // Asegura el tipo correcto

// Asume que la ruta es /[account]/page.tsx y Next.js pasa params.account
type PageProps = {
    params: Promise<{ account: string }>;
};

// Función auxiliar para obtener el ID de la cuenta a partir del slug
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

    // 1. Buscar el ID real de la cuenta
    const accountId = await getAccountIdBySlug(accountSlug);
    if (!accountId) {
        notFound();
    }

    // 2. Obtener la configuración de la cuenta
    const config = await getCatalogConfig(accountId);
    if (!config) {
        notFound();
    }

    // 3. Cargar productos filtrando por account_id
    const { data: products, error } = await supabase
        .from("products")
        .select(`
            id,
            slug,
            name,
            description,
            price,
            category,
            image_url,
            active,
            created_at
        `)
        .eq("active", true)
        .eq("account_id", accountId)
        .order("created_at", { ascending: false })
        .returns<Product[]>();

    if (error) {
        return (
            <main style={{ padding: 24 }}>
                <h1>Error</h1>
                <pre>{JSON.stringify(error, null, 2)}</pre>
            </main>
        );
    }

    return (
        <main>
            <h1>Productos</h1>
            <ProductGrid products={products} plan={config.plan as Plan} />
        </main>
    );
}
