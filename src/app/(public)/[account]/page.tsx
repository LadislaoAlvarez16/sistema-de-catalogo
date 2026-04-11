import { createPublicClient } from "@/lib/supabase/server-public";
import type { Product } from "@/types/product";
import ProductGrid from "@/components/catalog/ProductGrid";
import Footer from "@/components/layout/Footer";
import { getCatalogConfig } from "@/lib/config/getCatalogConfig";
import type { Plan } from "@/lib/plan/plan.config";
import { Metadata } from 'next';

type PageProps = {
    params: Promise<{ account: string }>;
};

// Modificamos esto para que devuelva el error y podamos verlo
async function getAccountDataBySlug(slug: string) {
    const supabase = await createPublicClient();
    const { data, error } = await supabase
        .from("accounts")
        .select("id, name, description")
        .eq("slug", slug)
        .maybeSingle<{ id: string; name: string; description: string | null }>();

    return { data, error };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { account: accountSlug } = await params;
    const { data: accountData } = await getAccountDataBySlug(accountSlug);

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

    const { data: accountData, error: accountError } = await getAccountDataBySlug(accountSlug);

    // CHIVATO 1: Si falla la conexión a la tabla accounts
    if (accountError) {
        return (
            <main style={{ padding: '50px', textAlign: 'center' }}>
                <h1 style={{ color: 'red', fontSize: '24px' }}>🛑 Error de Supabase (Tabla Accounts)</h1>
                <p>Mensaje: {accountError.message}</p>
            </main>
        );
    }

    // CHIVATO 2: Si conecta bien, pero no encuentra el slug
    if (!accountData) {
        return (
            <main style={{ padding: '50px', textAlign: 'center' }}>
                <h1 style={{ color: 'orange', fontSize: '24px' }}>⚠️ Cuenta no encontrada</h1>
                <p>Supabase conectó bien, pero dice que NO EXISTE el slug: <b>{accountSlug}</b></p>
                <p>Revisá en la base de datos si está escrito exactamente igual (mayúsculas, espacios, etc).</p>
            </main>
        );
    }

    const accountId = accountData.id;
    const config = await getCatalogConfig(accountId);

    // CHIVATO 3: Si encuentra la cuenta, pero falla al buscar su configuración
    if (!config) {
        return (
            <main style={{ padding: '50px', textAlign: 'center' }}>
                <h1 style={{ color: 'red', fontSize: '24px' }}>🛑 Error de Configuración</h1>
                <p>Encontró la cuenta {accountData.name}, pero <b>getCatalogConfig devolvió null</b>.</p>
            </main>
        );
    }

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
                <h1 style={{ color: 'red' }}>Error al cargar productos o categorías</h1>
                <pre>{JSON.stringify(prodError || catError, null, 2)}</pre>
            </main>
        );
    }

    return (
        <>
            <ProductGrid
                products={products || []}
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