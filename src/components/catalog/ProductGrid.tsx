"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/catalog/ProductModal";
import { getCatalogConfig } from "@/lib/config/getCatalogConfig";
import { canUseProductModal } from "@/lib/plan/plan.helpers";


type Props = {
    products: Product[];
};

export default function ProductGrid({ products }: Props) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const { plan } = getCatalogConfig();
    const canOpenModal = canUseProductModal(plan);


    if (products.length === 0) {
        return <p>No hay productos</p>;
    }

    const handleProductClick = (product: Product) => {
        if (plan === "basic") {
            return;
        }

        setSelectedProduct(product);
    };

    return (
        <>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
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

            {selectedProduct && selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </>
    );
}
