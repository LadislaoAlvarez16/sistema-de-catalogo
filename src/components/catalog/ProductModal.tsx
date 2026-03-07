"use client";

import type { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { getProductImageUrl } from "@/lib/storage/getProductImageUrl";
import type { Plan } from "@/lib/plan/plan.config";
import { canUseProductPage } from "@/lib/plan/plan.helpers";
import { useParams } from "next/navigation"; // 🟢 Importar useParams

type Props = {
    product: Product;
    plan: Plan;
    onClose: () => void;
};

export default function ProductModal({ product, plan, onClose }: Props) {
    const imageSrc = getProductImageUrl(product.image_url);
    const canOpenProductPage = canUseProductPage(plan);

    const params = useParams();
    const accountSlug = typeof params.account === "string" ? params.account : Array.isArray(params.account) ? params.account[0] : "";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-lg rounded-xl bg-zinc-950 p-6 border border-zinc-800"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-zinc-400 hover:text-white"
                >
                    ✕
                </button>
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={product.name}
                        width={500}
                        height={500}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                ) : (
                    <div className="w-full h-75 bg-gray-200 flex items-center justify-center rounded mb-4 text-gray-500">
                        Sin imagen
                    </div>
                )}
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                {product.description && (
                    <p className="text-zinc-400 mb-3">{product.description}</p>
                )}
                <p className="text-sm text-zinc-500">Categoría: {product.category} </p>
                {canOpenProductPage && accountSlug && (
                    <Link
                        href={`/${accountSlug}/product/${product.slug}`}
                        className="mt-4 inline-flex rounded-lg border border-zinc-700 px-4 py-2 text-sm text-white hover:bg-zinc-900"
                    >
                        Ver página del producto
                    </Link>
                )}
            </div>
        </div>
    );
}
