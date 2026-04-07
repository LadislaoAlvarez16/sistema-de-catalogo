import { createPublicClient } from "@/lib/supabase/server-public";
import type { Product } from "@/types/product";
import ProductGrid from "@/components/catalog/ProductGrid";
import Footer from "@/components/layout/Footer";
import { getCatalogConfig } from "@/lib/config/getCatalogConfig";
import { notFound } from "next/navigation";
import type { Plan } from "@/lib/plan/plan.config";
import { Metadata } from 'next';

type PageProps = {
    params: { account: string };
};

async function getAccountDataBySlug(slug: string) {
    const supabase = await createPublicClient();
    const { data, error } = await supabase
        .from("accounts")
        .select("id, name, description")
        .eq("slug", slug)
        .maybeSingle<{ id: string; name: string; description: string | null }>();

    if (error || !data) return null;
    return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { account: accountSlug } = await params;
    const accountData = await getAccountDataBySlug(accountSlug);

    if (!accountData) {
        return {
            title: "Catálogo no encontrado",
        };
    }

    const title = `${accountData.name} | Catálogo Online`;
    const description = accountData.description || `Explora el catálogo de productos de ${accountData.name}.`;

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            type: 'website',
            siteName: accountData.name,
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
        }
    };
}

export default async function PublicPage({ params }: PageProps) {
    const { account: accountSlug } = await params;

    const accountData = await getAccountDataBySlug(accountSlug);
    if (!accountData) notFound();

    const accountId = accountData.id;

    const config = await getCatalogConfig(accountId);
    if (!config) notFound();

    const supabase = await createPublicClient();
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

    // Le pasamos toda la info limpia al ProductGrid y él se encarga de dibujar el catálogo.
    return (
        <>
            <ProductGrid
                products={products}
                plan={config.plan as Plan}
                categories={categories || []}
                phoneNumber={config.whatsapp || undefined}
                accountData={accountData}
            />
            <Footer
                accountData={accountData}
                phoneNumber={config.whatsapp || undefined}
            />
        </>
    );
}