"use client"

import { useState } from 'react'
import QRCode from 'qrcode'
import { QrCode } from 'lucide-react'

export default function DownloadQRButton({ slug }: { slug: string }) {
    const [isGenerating, setIsGenerating] = useState(false)

    const handleDownload = async () => {
        try {
            setIsGenerating(true)
            const url = `${window.location.origin}/${slug}`
            const dataUrl = await QRCode.toDataURL(url, { 
                width: 512, 
                margin: 2,
                color: {
                    dark: '#111827',
                    light: '#FFFFFF'
                }
            })
            
            const link = document.createElement('a')
            link.href = dataUrl
            link.download = 'mi-catalogo-qr.png'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error("Error generando el código QR:", error)
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <button
            type="button"
            onClick={handleDownload}
            disabled={isGenerating || !slug}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <QrCode className="h-4 w-4" />
            {isGenerating ? "Generando..." : "Descargar QR de mi catálogo"}
        </button>
    )
}
