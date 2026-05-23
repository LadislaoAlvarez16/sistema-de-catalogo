import { createPublicClient } from "@/lib/supabase/server-public";
import { notFound } from 'next/navigation';
import type { Product } from "@/types/product";
import ProductGrid from "@/components/catalog/ProductGrid";
import Footer from "@/components/layout/Footer";
import { getCatalogConfig } from "@/lib/config/getCatalogConfig";
import type { Plan } from "@/lib/plan/plan.config";
import { Metadata } from 'next';
import { getProductImageUrl } from "@/lib/storage/getProductImageUrl";

export const dynamic = 'force-dynamic'; // Esto le dice a Next que NO cachee esta página, y que la ejecute SIEMPRE en el servidor. Es importante para que los cambios en Supabase se reflejen al instante sin tener que esperar a la revalidación de la caché.
type PageProps = {
    params: Promise<{ account: string }>;
};


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

    const supabase = await createPublicClient();
    const { data: firstProduct } = await supabase
        .from("products")
        .select("image_url")
        .eq("account_id", accountData.id)
        .eq("active", true)
        .limit(1)
        .maybeSingle();

    const openGraphImages = [];
    if (firstProduct?.image_url) {
        openGraphImages.push({
            url: getProductImageUrl(firstProduct.image_url),
            alt: `Imagen de catálogo de ${accountData.name}`,
        });
    }

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            type: 'website',
            siteName: accountData.name,
            images: openGraphImages,
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: openGraphImages.map(img => img.url),
        }
    };
}

export default async function PublicPage({ params }: PageProps) {
    const { account: accountSlug } = await params;

    const { data: accountData, error: accountError } = await getAccountDataBySlug(accountSlug);

    // AVISO1: Si falla la conexión a la tabla accounts
    if (accountError) {
        notFound();
    }

    // AVISO2: Si conecta bien, pero no encuentra el slug
    if (!accountData) {
        notFound();
    }

    const accountId = accountData.id;
    const config = await getCatalogConfig(accountId);

    // AVISO3: Si encuentra la cuenta, pero falla al buscar su configuración
    if (!config) {
        notFound();
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
        notFound();
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": accountData.name,
        "telephone": config.whatsapp || undefined,
        "url": `${baseUrl}/${accountSlug}`
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
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