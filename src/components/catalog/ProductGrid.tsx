"use client";
import { useState } from "react";
import type { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/catalog/ProductModal";

type Props = {
    products: Product[];
};

export default function ProductGrid({ products }: Props) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    if (products.length === 0) {
        return <p>No hay productos</p>;
    }

    return (
        <>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onClick={() => setSelectedProduct(product)}
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
