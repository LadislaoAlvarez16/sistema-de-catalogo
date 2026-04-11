import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import InteractiveImageWithZoom from "@/components/ui/InteractiveImageWithZoom";
import { getCatalogConfig } from "@/lib/config/getCatalogConfig";
import { getProductImageUrl } from "@/lib/storage/getProductImageUrl";
import type { Product } from "@/types/product";
import { createPublicClient } from "@/lib/supabase/server-public";
import { canShowPrices } from "@/lib/plan/plan.helpers";

type ProductPageProps = {
    params: Promise<{ account: string; slug: string }>;
};

async function getActiveProductBySlug(accountSlug: string, productSlug: string): Promise<Product | null> {
    const supabase = await createPublicClient();

    // First, get the account ID from the slug
    const { data: accountData, error: accountError } = await supabase
        .from("accounts")
        .select("id")
        .eq("slug", accountSlug)
        .maybeSingle<{ id: string }>();

    if (accountError || !accountData) return null;

    // Then, get the product by slug and account_id
    const { data: product, error: productError } = await supabase
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
        .eq("slug", productSlug)
        .eq("account_id", accountData.id)
        .eq("active", true)
        .maybeSingle<Product>();

    if (productError || !product) return null;
    return product;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { account: accountSlug, slug: productSlug } = await params;
    const product = await getActiveProductBySlug(accountSlug, productSlug);
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

export default async function ProductPage({ params }: ProductPageProps) {
    const { account, slug } = await params;
    const product = await getActiveProductBySlug(account, slug);
    if (!product) {
        notFound();
    }
    const config = await getCatalogConfig(product.account_id);
    if (!config) {
        notFound();
    }

    // 🔹 Replicamos la lógica del mensaje dinámico acá también
    const showPrice = canShowPrices(config.plan);
    const wpMessage = showPrice && product.price
        ? `Hola, me interesa el producto: *${product.name}* que está a *$${product.price}*. ¿Tienen stock?`
        : `Hola, me interesa el producto: *${product.name}*. ¿Me podrían dar más información?`;

    return (
        <main className="min-h-screen bg-white">
            <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
                <Link
                    href={`/${account}`}
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Volver al catálogo</span>
                </Link>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12 items-start">
                    <InteractiveImageWithZoom
                        src={getProductImageUrl(product.image_url)}
                        alt={product.name}
                        className="aspect-square relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
                    />

                    <div className="flex flex-col">
                        <p className="mb-3 text-sm font-bold text-blue-600 uppercase tracking-wider">
                            {product.category}
                        </p>

                        <h1 className="mb-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            {product.name}
                        </h1>

                        {showPrice && product.price !== null && (
                            <p className="mb-6 text-3xl font-bold text-gray-900">
                                ${product.price}
                            </p>
                        )}

                        <hr className="my-6 border-gray-100" />

                        {product.description && (
                            <p className="mb-8 whitespace-pre-wrap text-base leading-relaxed text-gray-600">
                                {product.description}
                            </p>
                        )}

                        <div className="mt-auto">
                            <WhatsAppButton
                                message={wpMessage}
                                phoneNumber={config.whatsapp || undefined}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}