import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { appConfig } from "@/lib/config/app.config";
import { getCatalogConfig } from "@/lib/config/getCatalogConfig";
import { canShowPrices, canUseProductPage } from "@/lib/plan/plan.helpers";
import { getProductImageUrl } from "@/lib/storage/getProductImageUrl";
import { supabase } from "@/lib/supabase/client";
import type { Product } from "@/types/product";

type ProductPageProps = {
    params: Promise<{ slug: string }>;
};

async function getActiveProductBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await supabase
        .from("products")
        .select(
            `
            id,
            slug,
            name,
            description,
            price,
            category,
            image_url,
            active
        `
        )
        .eq("slug", slug)
        .eq("active", true)
        .maybeSingle<Product>();

    if (error) {
        return null;
    }

    return data;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { plan } = getCatalogConfig();

    if (!canUseProductPage(plan)) {
        return {
            robots: {
                index: false,
                follow: false,
            },
        };
    }

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

    const title = `${product.name} | ${appConfig.seo.title}`;
    const description = product.description ?? appConfig.seo.description;
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

export default async function ProductPage({ params }: ProductPageProps) {
    const { plan } = getCatalogConfig();

    if (!canUseProductPage(plan)) {
        notFound();
    }

    const { slug } = await params;
    const product = await getActiveProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const showPrice = canShowPrices(plan);
    const imageSrc = getProductImageUrl(product.image_url);

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 p-6">
            <Image
                src={imageSrc}
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
                {showPrice && product.price !== null && (
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
