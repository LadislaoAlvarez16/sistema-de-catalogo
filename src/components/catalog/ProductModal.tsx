"use client";

import type { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { getProductImageUrl } from "@/lib/storage/getProductImageUrl";
import { getCatalogConfig } from "@/lib/config/getCatalogConfig";
import { canUseProductPage } from "@/lib/plan/plan.helpers";


type Props = {
    product: Product;
    onClose: () => void;
};

export default function ProductModal({ product, onClose }: Props) {
    const imageSrc = getProductImageUrl(product.image_url);
    const { plan } = getCatalogConfig();
    const canOpenProductPage = canUseProductPage(plan);

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

                <Image
                    src={imageSrc}
                    alt={product.name}
                    width={500}
                    height={500}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                />


                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>

                {product.description && (
                    <p className="text-zinc-400 mb-3">{product.description}</p>
                )}

                <p className="text-sm text-zinc-500">Categoría: {product.category} </p>

                {canOpenProductPage && (
                    <Link
                        href={`/product/${product.slug}`}
                        className="mt-4 inline-flex rounded-lg border border-zinc-700 px-4 py-2 text-sm text-white hover:bg-zinc-900"
                    >
                        Ver página del producto
                    </Link>
                )}
            </div>
        </div>
    );
}
