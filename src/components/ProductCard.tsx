import { Eye } from "lucide-react";
import Image from "next/image";
import { canShowPrices } from "@/lib/plan/plan.helpers";
import type { Plan } from "@/lib/plan/plan.config";
import { getProductImageUrl } from "@/lib/storage/getProductImageUrl";
import type { Product } from "@/types/product";

type Props = {
    product: Product;
    plan: Plan;
    phoneNumber?: string;
    onClick?: () => void;
};

export default function ProductCard({ product, plan, onClick }: Props) {
    const showPrice = canShowPrices(plan);
    const imageSrc = getProductImageUrl(product.image_url);
    const priceLabel = showPrice && product.price !== null ? `$${product.price}` : "Consultar";

    return (
        <li className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            <div className="relative h-48 w-full bg-gray-100">
                <Image
                    src={imageSrc}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                />
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

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                        <span className="text-xl font-bold text-gray-900">{priceLabel}</span>

                        <button
                            type="button"
                            onClick={onClick}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                        >
                            <Eye className="h-4 w-4" />
                            <span>Ver</span>
                        </button>
                    </div>
                </div>
            </div>
        </li>
    );
}