import { supabase } from "@/lib/supabase/client";
import type { Product } from "@/types/product";
import ProductGrid from "@/components/catalog/ProductGrid";
import { getCatalogConfig } from "@/lib/config/getCatalogConfig";
import { notFound } from "next/navigation";
import type { Plan } from "@/lib/plan/plan.config";
import { Metadata } from 'next';

type PageProps = {
    params: Promise<{ account: string }>;
};

//Cambiamos el nombre y le decimos que traiga más campos
async function getAccountDataBySlug(slug: string) {
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
            // Opcional: Si el local tiene un logo, podrías poner la URL acá. 
            // images: ['https://tu-dominio.com/logo-default.jpg'], 
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

    //Usamos la nueva función para obtener toda la info
    const accountData = await getAccountDataBySlug(accountSlug);
    if (!accountData) notFound();

    const accountId = accountData.id; // Extraemos el ID para seguir usándolo abajo

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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/*Reemplazamos el h1 "Productos" por el encabezado dinámico */}
            <div className="mb-8 border-b border-zinc-800 pb-6 text-center sm:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {accountData.name || "Catálogo de Productos"}
                </h1>
                {accountData.description && (
                    <p className="text-zinc-400 text-lg max-w-2xl mt-2">
                        {accountData.description}
                    </p>
                )}
            </div>

            <ProductGrid
                products={products}
                plan={config.plan as Plan}
                categories={categories || []}
                phoneNumber={config.whatsapp || undefined}
            />
        </main>
    );
}