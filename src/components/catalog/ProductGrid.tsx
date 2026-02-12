"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/catalog/ProductModal";
import { getCatalogConfig } from "@/lib/config/getCatalogConfig";
import { canUseProductModal } from "@/lib/plan/plan.helpers";
import { getPlanRules } from "@/lib/plan/plan.helpers";


type Props = {
    products: Product[];
};

export default function ProductGrid({ products }: Props) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const { plan } = getCatalogConfig();
    const rules = getPlanRules(plan);

    const canOpenModal = canUseProductModal(plan);

    const categories = Array.from(
        new Set(products.map((p) => p.category).filter(Boolean))
    );

    const filteredProducts =
        selectedCategory === "all"
            ? products
            : products.filter((p) => p.category === selectedCategory);

    if (products.length === 0) {
        return <p>No hay productos</p>;
    }

    const handleProductClick = (product: Product) => {
        if (!canOpenModal) return;
        setSelectedProduct(product);
    };

    return (
        <>
            {rules.filters && (
                <div className="mb-6 flex gap-3 flex-wrap">
                    <button
                        onClick={() => setSelectedCategory("all")}
                        className={`px-4 py-2 rounded-lg border ${selectedCategory === "all"
                                ? "bg-white text-black"
                                : "border-zinc-700 text-zinc-400"
                            }`}
                    >
                        Todas
                    </button>

                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category as string)}
                            className={`px-4 py-2 rounded-lg border ${selectedCategory === category
                                    ? "bg-white text-black"
                                    : "border-zinc-700 text-zinc-400"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            )}

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onClick={
                            canOpenModal
                                ? () => handleProductClick(product)
                                : undefined
                        }
                    />
                ))}
            </ul>

            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </>
    );

}
