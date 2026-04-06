"use client";

import { useEffect } from "react";
import { ExternalLink, MessageCircle, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import InteractiveImageWithZoom from "@/components/ui/InteractiveImageWithZoom";
import { getProductImageUrl } from "@/lib/storage/getProductImageUrl";
import type { Plan } from "@/lib/plan/plan.config";
import { canShowPrices, getPlanRules } from "@/lib/plan/plan.helpers";
import type { Product } from "@/types/product";

type Props = {
    product: Product;
    plan: Plan;
    phoneNumber?: string;
    onClose: () => void;
};

export default function ProductModal({ product, plan, phoneNumber, onClose }: Props) {
    const imageSrc = getProductImageUrl(product.image_url);
    const showPrice = canShowPrices(plan);
    const rules = getPlanRules(plan);
    const params = useParams<{ account?: string | string[] }>();
    const accountSlug = Array.isArray(params.account) ? params.account[0] : params.account;

    useEffect(() => {
        const previousBodyOverflow = document.body.style.overflow;
        const previousHtmlOverflow = document.documentElement.style.overflow;

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousBodyOverflow;
            document.documentElement.style.overflow = previousHtmlOverflow;
        };
    }, []);

    const whatsappMessage = showPrice && product.price !== null
        ? `Hola, me interesa el producto: *${product.name}* que está a *$${product.price}*. ¿Tienen stock?`
        : `Hola, me interesa el producto: *${product.name}*. ¿Me podrían dar más información?`;
    const cleanPhone = phoneNumber?.replace(/\D/g, "") ?? "";
    const whatsappHref = cleanPhone
        ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`
        : `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-4xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Cerrar modal"
                    className="absolute top-6 right-6 text-gray-400 transition-colors hover:text-gray-900"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="px-8 pt-8 pb-4">
                    <h2 className="mb-1 text-3xl font-normal text-gray-900 md:text-4xl">
                        {product.name}
                    </h2>
                    <p className="mb-2 text-sm font-light text-gray-500">
                        {product.category || "Sin categoría"}
                    </p>
                </div>

                <div className="custom-scrollbar flex-1 overflow-y-auto p-6 md:p-8">
                    {imageSrc ? (
                        <InteractiveImageWithZoom
                            src={imageSrc}
                            alt={product.name}
                            className="mb-6 h-64 w-full rounded-2xl bg-gray-100 md:h-80"
                        />
                    ) : (
                        <div className="mb-6 flex h-64 w-full items-center justify-center rounded-2xl bg-gray-100 text-gray-500 md:h-80">
                            Sin imagen
                        </div>
                    )}

                    <p className="mb-6 text-base leading-relaxed text-gray-600">
                        {product.description || "Consultanos por este producto y te compartimos más información."}
                    </p>
                </div>

                <div className="flex flex-col gap-3 border-t border-gray-100 bg-white p-6 sm:flex-row">
                    <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex flex-1 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-lg font-semibold text-white shadow-md transition-all hover:bg-[#20bd5a] hover:shadow-lg"
                    >
                        <MessageCircle className="h-5 w-5" />
                        <span>Consultar</span>
                    </a>

                    {rules.productPage && accountSlug && (
                        <Link
                            href={`/${accountSlug}/product/${product.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex flex-1 w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white py-3 text-base font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
                        >
                            <ExternalLink className="h-4 w-4" />
                            <span>Ver detalles del producto</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
