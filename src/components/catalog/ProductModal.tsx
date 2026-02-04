"use client";

import type { Product } from "@/types/product";
import Image from "next/image";
import { getProductImageUrl } from "@/lib/storage/getProductImageUrl";

type Props = {
    product: Product;
    onClose: () => void;
};

export default function ProductModal({ product, onClose }: Props) {
    const imageSrc = getProductImageUrl(product.image_url);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="relative w-full max-w-lg rounded-xl bg-zinc-950 p-6 border border-zinc-800">

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-zinc-400 hover:text-white"
                >
                    ✕
                </button>

                {/* Image */}
                <Image
                    src={imageSrc}
                    alt={product.name}
                    width={500}
                    height={500}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                />

                {/* Content */}
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>

                {product.description && (
                    <p className="text-zinc-400 mb-3">{product.description}</p>
                )}

                <p className="text-sm text-zinc-500">
                    Categoría: {product.category}
                </p>
            </div>
        </div>
    );
}
