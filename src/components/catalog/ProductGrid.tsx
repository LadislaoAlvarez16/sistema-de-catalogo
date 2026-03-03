"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/catalog/ProductModal";
import type { Plan } from "@/lib/plan/plan.config";
import { canUseProductModal, getPlanRules } from "@/lib/plan/plan.helpers";

type Props = {
    products: Product[];
    plan: Plan;
};

type SortOption = "name-asc" | "name-desc" | "category";

export default function ProductGrid({ products, plan }: Props) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("name-asc");

    const rules = getPlanRules(plan);
    const canOpenModal = canUseProductModal(plan);
    const canUseSearch = plan !== "basic";
    const canUseSort = plan !== "basic";

    // 🔹 Obtener categorías únicas
    const categories = Array.from(
        new Set(products.map((p) => p.category).filter(Boolean))
    );

    // 🔹 Limitar categorías según plan
    const allowedCategories =
        rules.categoryLimit === Infinity
            ? categories
            : categories.slice(0, rules.categoryLimit);

    // 🔹 Limitar productos a categorías permitidas
    const productsWithinCategoryLimit =
        rules.categoryLimit === Infinity
            ? products
            : products.filter((p) =>
                allowedCategories.includes(p.category as string)
            );

    // 🔹 Filtro por categoría
    const categoryFiltered =
        selectedCategory === "all"
            ? productsWithinCategoryLimit
            : productsWithinCategoryLimit.filter(
                (p) => p.category === selectedCategory
            );

    // 🔹 Filtro por búsqueda
    const searchFiltered =
        canUseSearch && searchQuery.trim() !== ""
            ? categoryFiltered.filter((p) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            : categoryFiltered;

    // 🔹 Ordenamiento
    const sortedProducts = [...searchFiltered].sort((a, b) => {
        if (!canUseSort) return 0;

        switch (sortBy) {
            case "name-asc":
                return a.name.localeCompare(b.name);
            case "name-desc":
                return b.name.localeCompare(a.name);
            case "category":
                return (a.category || "").localeCompare(b.category || "");
            default:
                return 0;
        }
    });

    if (products.length === 0) {
        return <p>No hay productos</p>;
    }

    // 🔹 Aplicar límite final
    const limitedProducts =
        rules.productLimit === Infinity
            ? sortedProducts
            : sortedProducts.slice(0, rules.productLimit);

    const handleProductClick = (product: Product) => {
        if (!canOpenModal) return;
        setSelectedProduct(product);
    };

    return (
        <>
            {/* 🔎 Buscador */}
            {canUseSearch && (
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500 focus:outline-none focus:border-white"
                    />
                </div>
            )}

            {/* 🔃 Ordenamiento */}
            {canUseSort && (
                <div className="mb-6">
                    <select
                        value={sortBy}
                        onChange={(e) =>
                            setSortBy(e.target.value as SortOption)
                        }
                        className="px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-white focus:outline-none focus:border-white"
                    >
                        <option value="name-asc">Nombre A–Z</option>
                        <option value="name-desc">Nombre Z–A</option>
                        <option value="category">Categoría</option>
                    </select>
                </div>
            )}

            {/* 🔘 Filtros por categoría */}
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

                    {allowedCategories.map((category) => (
                        <button
                            key={category}
                            onClick={() =>
                                setSelectedCategory(category as string)
                            }
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
                {limitedProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        plan={plan}
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
