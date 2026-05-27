'use client'

import { useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { Plus, Copy, Check, MessageCircle, ArrowRight } from 'lucide-react'

interface OnboardingFlowProps {
  slug: string | null | undefined
}

const emptySubscribe = () => () => {}
const getClientOrigin = () => window.location.origin
const getServerOrigin = () => ''

export default function OnboardingFlow({ slug }: OnboardingFlowProps) {
  const [copied, setCopied] = useState(false)
  
  const origin = useSyncExternalStore(emptySubscribe, getClientOrigin, getServerOrigin)

  // 3. Derivamos la URL final como una constante normal, sin usar estados adicionales.
  // Si origin aún es '', catalogUrl será ''. Cuando el useEffect actúe, se recalculará automáticamente.
  const catalogUrl = origin && slug ? `${origin}/${slug}` : ''

  const handleCopy = async () => {
    if (!catalogUrl) return

    // Verificamos si la API de Clipboard está disponible
    if (!navigator?.clipboard) {
      alert(`Tu navegador no soporta copiado automático. Por favor, copiá manualmente este enlace:\n\n${catalogUrl}`)
      return
    }

    try {
      await navigator.clipboard.writeText(catalogUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err)
      alert(`No se pudo copiar automáticamente. Por favor, copiá manualmente este enlace:\n\n${catalogUrl}`)
    }
  }

  // Mensaje predefinido para WhatsApp
  const whatsappMessage = encodeURIComponent(`¡Hola! Te invito a ver nuestro catálogo de productos aquí: ${catalogUrl}`)
  const whatsappUrl = catalogUrl ? `https://wa.me/?text=${whatsappMessage}` : '#'

  return (
    <div className="mt-8 bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">¡Configurá tu catálogo!</h2>
        <p className="text-gray-600 text-lg">Seguí estos 3 simples pasos para empezar a recibir pedidos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Paso 1: Agregar producto */}
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm relative z-10">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl mb-5 shadow-inner">1</div>
          <h3 className="font-bold text-gray-900 mb-2 text-lg">Agregá un producto</h3>
          <p className="text-sm text-gray-500 mb-6 grow">Subí fotos, precios y detalles de los artículos que vendés.</p>
          <Link
            href="/admin/dashboard/nuevo"
            className="w-full justify-center bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Agregar producto
          </Link>
        </div>

        {/* Flecha conectora 1 (desktop) */}
        <div className="hidden md:flex absolute top-1/2 left-1/3 -translate-y-1/2 -translate-x-1/2 text-gray-300 z-0">
          <ArrowRight className="w-8 h-8" />
        </div>

        {/* Paso 2: Copiar link */}
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm relative z-10">
          <div className="w-14 h-14 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center font-bold text-xl mb-5 shadow-inner">2</div>
          <h3 className="font-bold text-gray-900 mb-2 text-lg">Copiá tu enlace</h3>
          <p className="text-sm text-gray-500 mb-6 grow">Obtené el link único de tu tienda para poder compartirlo.</p>
          <button
            onClick={handleCopy}
            disabled={!slug}
            className={`w-full justify-center px-4 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 shadow-sm ${
              !slug ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' :
              copied ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? '¡Link copiado!' : 'Copiar URL'}
          </button>
        </div>

        {/* Flecha conectora 2 (desktop) */}
        <div className="hidden md:flex absolute top-1/2 right-1/3 -translate-y-1/2 translate-x-1/2 text-gray-300 z-0">
          <ArrowRight className="w-8 h-8" />
        </div>

        {/* Paso 3: Compartir */}
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm relative z-10 overflow-hidden">
          {/* Fondo decorativo sutil para el último paso */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-50 rounded-full z-0 opacity-50"></div>
          
          <div className="w-14 h-14 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-xl mb-5 shadow-inner relative z-10">3</div>
          <h3 className="font-bold text-gray-900 mb-2 text-lg relative z-10">Compartí y vendé</h3>
          <p className="text-sm text-gray-500 mb-6 grow relative z-10">Enviáselo a tus clientes por WhatsApp y recibí pedidos.</p>
          <a
            href={slug ? whatsappUrl : '#'}
            target={slug ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className={`w-full justify-center px-4 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 shadow-sm relative z-10 ${
              !slug ? 'bg-green-100 text-green-400 cursor-not-allowed border border-green-200' : 'bg-[#25D366] hover:bg-[#128C7E] text-white'
            }`}
          >
            <MessageCircle className="w-4 h-4" /> Compartir
          </a>
        </div>
      </div>
    </div>
  )
}
