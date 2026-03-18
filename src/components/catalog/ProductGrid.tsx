"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/catalog/ProductModal";
import type { Plan } from "@/lib/plan/plan.config";
import { canUseProductModal, getPlanRules } from "@/lib/plan/plan.helpers";

type Category = {
    id: string;
    name: string;
    slug: string;
};

type Props = {
    products: Product[];
    plan: Plan;
    categories: Category[];
    phoneNumber?: string; // 🔹 Recibimos el número acá
};

type SortOption = "name-asc" | "name-desc" | "category";

export default function ProductGrid({ products, plan, categories, phoneNumber }: Props) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("name-asc");

    const rules = getPlanRules(plan);
    const canOpenModal = canUseProductModal(plan);
    const canUseSearch = plan !== "basic";
    const canUseSort = plan !== "basic";

    const allowedCategories =
        rules.categoryLimit === Infinity
            ? categories
            : categories.slice(0, rules.categoryLimit);

    const allowedCategoryNames = allowedCategories.map(c => c.name);

    const productsWithinCategoryLimit =
        rules.categoryLimit === Infinity
            ? products
            : products.filter((p) =>
                allowedCategoryNames.includes(p.category as string)
            );

    const categoryFiltered =
        selectedCategory === "all"
            ? productsWithinCategoryLimit
            : productsWithinCategoryLimit.filter(
                (p) => p.category === selectedCategory
            );

    const searchFiltered =
        canUseSearch && searchQuery.trim() !== ""
            ? categoryFiltered.filter((p) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            : categoryFiltered;

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
        return <p className="text-zinc-400">No hay productos para mostrar.</p>;
    }

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

            {rules.filters && (
                <div className="mb-6 flex gap-3 flex-wrap">
                    <button
                        onClick={() => setSelectedCategory("all")}
                        className={`px-4 py-2 rounded-lg border transition ${selectedCategory === "all"
                            ? "bg-white text-black font-medium"
                            : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                            }`}
                    >
                        Todas
                    </button>

                    {allowedCategories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.name)}
                            className={`px-4 py-2 rounded-lg border transition ${selectedCategory === category.name
                                ? "bg-white text-black font-medium"
                                : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                                }`}
                        >
                            {category.name}
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
                        phoneNumber={phoneNumber} // 🔹 Se lo pasamos a la tarjeta
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
                    plan={plan}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </>
    );
}