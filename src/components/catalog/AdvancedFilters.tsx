"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function AdvancedFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [prevSearchParams, setPrevSearchParams] = useState(searchParams);
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

    if (searchParams !== prevSearchParams) {
        setPrevSearchParams(searchParams);
        setMinPrice(searchParams.get("minPrice") || "");
        setMaxPrice(searchParams.get("maxPrice") || "");
    }

    const handleApplyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (minPrice && !isNaN(Number(minPrice))) {
            params.set("minPrice", minPrice);
        } else {
            params.delete("minPrice");
        }

        if (maxPrice && !isNaN(Number(maxPrice))) {
            params.set("maxPrice", maxPrice);
        } else {
            params.delete("maxPrice");
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    const handleClearFilters = () => {
        setMinPrice("");
        setMaxPrice("");
        const params = new URLSearchParams(searchParams.toString());
        params.delete("minPrice");
        params.delete("maxPrice");
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-end">
            <div className="w-full sm:w-auto flex-1">
                <label htmlFor="minPrice" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Precio Mínimo
                </label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                    <input
                        type="number"
                        id="minPrice"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="0"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                </div>
            </div>
            
            <div className="w-full sm:w-auto flex-1">
                <label htmlFor="maxPrice" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Precio Máximo
                </label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                    <input
                        type="number"
                        id="maxPrice"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="10000"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <button
                    onClick={handleApplyFilters}
                    className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    Filtrar
                </button>
                {(searchParams.has("minPrice") || searchParams.has("maxPrice")) && (
                    <button
                        onClick={handleClearFilters}
                        className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        Limpiar
                    </button>
                )}
            </div>
        </div>
    );
}