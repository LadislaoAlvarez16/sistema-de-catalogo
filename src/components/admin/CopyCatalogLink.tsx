'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function CopyCatalogLink({ slug }: { slug: string }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        // Obtenemos el origen de la ventana actual dinámicamente
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tudominio.com'
        const url = `${origin}/${slug}`

        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Error al copiar al portapapeles:', err)
        }
    }

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
            title="Copiar link del catálogo"
        >
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            <span className="hidden sm:inline">{copied ? '¡Copiado!' : 'Copiar URL'}</span>
        </button>
    )
}
