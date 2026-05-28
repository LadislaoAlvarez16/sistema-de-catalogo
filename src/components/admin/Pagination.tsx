'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ totalPages, currentPage }: { totalPages: number, currentPage: number }) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', pageNumber.toString())
        return `${pathname}?${params.toString()}`
    }

    const handlePageChange = (page: number) => {
        replace(createPageURL(page), { scroll: false })
    }

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between mt-6">
            <span className="text-sm text-gray-600">
                Página <span className="font-semibold text-gray-900">{currentPage}</span> de <span className="font-semibold text-gray-900">{totalPages}</span>
            </span>
            <div className="flex gap-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:pointer-events-none shadow-sm"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                </button>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:pointer-events-none shadow-sm"
                >
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
