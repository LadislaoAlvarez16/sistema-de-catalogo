import { Eye, MessageCircle } from "lucide-react";
import Image from "next/image";
import { canShowPrices } from "@/lib/plan/plan.helpers";
import type { Plan } from "@/lib/plan/plan.config";
import { getProductImageUrl } from "@/lib/storage/getProductImageUrl";
import type { Product } from "@/types/product";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";

type Props = {
    product: Product;
    plan: Plan;
    phoneNumber?: string;
    onClick?: () => void;
};

export default function ProductCard({ product, plan, phoneNumber, onClick }: Props) {
    const showPrice = canShowPrices(plan);
    const imageSrc = getProductImageUrl(product.image_url);
    const formattedPrice = product.price !== null ? new Intl.NumberFormat('es-AR').format(product.price) : "";
    const priceLabel = showPrice && product.price !== null ? `$${formattedPrice}` : "Consultar";

    const cleanPhone = phoneNumber?.replace(/\D/g, "") ?? "";
    const whatsappHref = cleanPhone
        ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hola, me interesa el producto ${product.name} que vi en el catálogo.`)}`
        : "#";

    return (
        <li
            onClick={onClick}
            className={`flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md ${onClick ? "cursor-pointer" : ""}`}
        >
            <div className="relative h-48 w-full bg-gray-100">
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                    />
                ) : (
                    <ImagePlaceholder className="h-full w-full" />
                )}
            </div>

            <div className="flex grow flex-col p-5">
                <p className="mb-1 text-xs uppercase tracking-wide text-gray-500">
                    {product.category || "Sin categoría"}
                </p>

                <h2 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900">
                    {product.name}
                </h2>

                <div className="mt-auto">
                    <p className="line-clamp-3 text-sm text-gray-600">
                        {product.description || "Descubrí más detalles de este producto en un solo clic."}
                    </p>

                    <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4">
                        <span className="text-lg sm:text-xl font-bold text-gray-900 self-start">{priceLabel}</span>

                        <div className="flex w-full gap-2 justify-end">
                            {phoneNumber && (
                                <a
                                    href={whatsappHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center justify-center rounded-lg bg-green-500 w-11 h-11 text-white transition-all hover:bg-green-600 active:scale-95"
                                    title="Consultar por WhatsApp"
                                >
                                    <MessageCircle className="h-5 w-5" />
                                </a>
                            )}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClick?.();
                                }}
                                className="flex items-center justify-center rounded-lg bg-blue-600 w-11 h-11 text-white transition-all hover:bg-blue-700 active:scale-95"
                                title="Ver detalles"
                            >
                                <Eye className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
}