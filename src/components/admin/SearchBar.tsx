'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { useTransition, useState, useEffect } from 'react'

export default function SearchBar() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()
    
    const initialQuery = searchParams.get('query') || ''
    const [searchTerm, setSearchTerm] = useState(initialQuery)
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        setSearchTerm(initialQuery)
    }, [initialQuery])

    const handleSearch = (term: string) => {
        setSearchTerm(term)
        
        startTransition(() => {
            const params = new URLSearchParams(searchParams)
            params.set('page', '1') // Reset page on new search
            if (term) {
                params.set('query', term)
            } else {
                params.delete('query')
            }
            replace(`${pathname}?${params.toString()}`, { scroll: false })
        })
    }

    return (
        <div className="relative flex flex-1 w-full sm:max-w-sm">
            <label htmlFor="search" className="sr-only">Buscar productos</label>
            <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <Search className="w-5 h-5" />
                </div>
                <input
                    type="text"
                    id="search"
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-900 focus:border-gray-900 block w-full pl-10 p-2.5 transition-colors shadow-sm outline-none"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
            {isPending && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    )
}
