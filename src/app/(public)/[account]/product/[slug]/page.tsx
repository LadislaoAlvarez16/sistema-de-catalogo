import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { getCatalogConfig } from "@/lib/config/getCatalogConfig";
import { getProductImageUrl } from "@/lib/storage/getProductImageUrl";
import type { Product } from "@/types/product";
import { supabase } from "@/lib/supabase/client";
import { canShowPrices } from "@/lib/plan/plan.helpers";

// Tipado correcto para params como Promise<{ account: string; slug: string }>
type ProductPageProps = {
    params: Promise<{ account: string; slug: string }>;
};

// Función auxiliar para obtener el producto activo por slug
async function getActiveProductBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await supabase
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
            account_id
        `)
        .eq("slug", slug)
        .eq("active", true)
        .maybeSingle<Product>();
    if (error) return null;
    return data;
}

// Usar await params antes de desestructurar
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = await getActiveProductBySlug(slug);
    if (!product) {
        return {
            title: "Producto no encontrado",
            robots: {
                index: false,
                follow: false,
            },
        };
    }
    const config = await getCatalogConfig(product.account_id);
    const title = product.name;
    const description = product.description ?? config?.name ?? "";
    const imageUrl = getProductImageUrl(product.image_url);

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [
                {
                    url: imageUrl,
                    alt: product.name,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        },
    };
}

// Usar await params antes de desestructurar
export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const product = await getActiveProductBySlug(slug);
    if (!product) {
        notFound();
    }
    const config = await getCatalogConfig(product.account_id);
    if (!config) {
        notFound();
    }

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 p-6">
            <Image
                src={getProductImageUrl(product.image_url)}
                alt={product.name}
                width={1200}
                height={1200}
                className="h-80 w-full rounded-xl object-cover border border-zinc-800"
                priority
            />

            <div className="space-y-2">
                <h1 className="text-3xl font-semibold">{product.name}</h1>
                <p className="text-zinc-400">Categoría: {product.category}</p>
                {product.description && (
                    <p className="text-zinc-300 leading-relaxed">{product.description}</p>
                )}
                {canShowPrices(config.plan) && product.price !== null && (
                    <p className="text-2xl font-bold">${product.price}</p>
                )}
            </div>

            <div>
                <WhatsAppButton
                    message={`Hola, estoy interesado en el producto: ${product.name}`}
                />
            </div>
        </main>
    );
}
