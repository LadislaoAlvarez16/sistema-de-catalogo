"use client";

import { useState } from "react";
import { Search, Menu, MessageCircle, X, ChevronRight } from "lucide-react";
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
    phoneNumber?: string;
    accountData: { name: string; description: string | null }; // 🔹 Agregado para el Header
};

type SortOption = "name-asc" | "name-desc" | "category";

const PRODUCTS_PER_PAGE = 8;

export default function ProductGrid({ products, plan, categories, phoneNumber, accountData }: Props) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("name-asc");
    const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);

    // 🔹 Estado para el menú de categorías (TKT-01 y TKT-02)
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            case "name-asc": return a.name.localeCompare(b.name);
            case "name-desc": return b.name.localeCompare(a.name);
            case "category": return (a.category || "").localeCompare(b.category || "");
            default: return 0;
        }
    });

    const limitedProducts =
        rules.productLimit === Infinity
            ? sortedProducts
            : sortedProducts.slice(0, rules.productLimit);

    const paginatedProducts = limitedProducts.slice(0, visibleCount);
    const hasMoreProducts = visibleCount < limitedProducts.length;

    const handleProductClick = (product: Product) => {
        if (!canOpenModal) return;
        setSelectedProduct(product);
    };

    return (
        <div className="min-h-screen w-full bg-white font-sans text-gray-900">
            <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
                <div className="flex w-full items-center justify-between px-3 py-3 sm:px-6">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen((prev) => !prev)}
                            className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:px-4"
                        >
                            <Menu className="h-5 w-5 text-gray-600" />
                            <span className="hidden sm:inline">Categorías</span>
                        </button>

                        <span className="max-w-40 truncate text-base font-semibold text-gray-900 sm:max-w-none sm:text-lg">
                            {accountData?.name || "Catálogo"}
                        </span>
                    </div>

                    {phoneNumber && (
                        <a
                            href={`https://wa.me/${phoneNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Consultar por WhatsApp"
                            className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-gray-100 px-3 py-2 text-xs font-medium text-gray-800 transition-colors hover:bg-gray-200 sm:px-4 sm:text-sm"
                        >
                            <MessageCircle className="h-4 w-4 text-green-600" />
                            <span className="hidden sm:inline">Consultar</span>
                        </a>
                    )}
                </div>
            </header>

            {isMenuOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}>
                    <aside
                        className="fixed top-0 left-0 z-50 flex h-full w-80 max-w-[85vw] transform flex-col bg-white shadow-2xl transition-transform duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-900">Categorías</h2>
                            <button
                                type="button"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-gray-500 transition-colors hover:text-gray-900"
                                aria-label="Cerrar menú"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {canUseSort && (
                                <div className="mb-6">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => {
                                            setSortBy(e.target.value as SortOption);
                                            setVisibleCount(PRODUCTS_PER_PAGE);
                                        }}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    >
                                        <option value="name-asc">Nombre A–Z</option>
                                        <option value="name-desc">Nombre Z–A</option>
                                        <option value="category">Categoría</option>
                                    </select>
                                </div>
                            )}

                            <div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedCategory("all");
                                        setVisibleCount(PRODUCTS_PER_PAGE);
                                        setIsMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between border-b border-gray-50 py-4 text-left transition-colors ${selectedCategory === "all" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`}
                                >
                                    <span>Todos los productos</span>
                                    <ChevronRight className="h-4 w-4 text-gray-400" />
                                </button>

                                {allowedCategories.map((category) => (
                                    <button
                                        key={category.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedCategory(category.name);
                                            setVisibleCount(PRODUCTS_PER_PAGE);
                                            setIsMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between border-b border-gray-50 py-4 text-left transition-colors ${selectedCategory === category.name ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`}
                                    >
                                        <span>{category.name}</span>
                                        <ChevronRight className="h-4 w-4 text-gray-400" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            )}

            <section className="mx-auto flex max-w-4xl flex-col items-center px-4 pt-8 text-center">
                <h1 className="mb-4 text-center text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                    Descubrí Nuestro Catálogo Completo
                </h1>
                {accountData?.description && (
                    <p className="max-w-2xl text-base leading-relaxed text-gray-500 md:text-lg">
                        {accountData.description}
                    </p>
                )}

                {canUseSearch && (
                    <div className="relative mt-6 mb-8 w-full max-w-3xl">
                        <div className="group relative">
                            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                <Search className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setVisibleCount(PRODUCTS_PER_PAGE);
                                }}
                                className="w-full rounded-2xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                    </div>
                )}
            </section>

            <main className="mx-auto w-full max-w-5xl px-4 pb-16">
                {products.length === 0 ? (
                    <p className="py-12 text-center text-gray-500">No hay productos para mostrar.</p>
                ) : (
                    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {paginatedProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                plan={plan}
                                phoneNumber={phoneNumber}
                                onClick={canOpenModal ? () => handleProductClick(product) : undefined}
                            />
                        ))}
                    </ul>
                )}

                {hasMoreProducts && (
                    <div className="mt-12 flex justify-center">
                        <button
                            onClick={() => setVisibleCount((prev) => prev + PRODUCTS_PER_PAGE)}
                            className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                        >
                            Cargar más productos
                        </button>
                    </div>
                )}
            </main>

            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    plan={plan}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
}