"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import LogoutButton from './LogoutButton'

export default function DashboardMobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      {/* Botón hamburguesa (Mobile) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Menú Desktop (Fila) */}
      <div className="hidden md:flex items-center gap-3">
        <Link
          href="/admin/perfil"
          className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
        >
          Perfil
        </Link>
        <Link
          href="/admin/dashboard/categorias"
          className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
        >
          Categorías
        </Link>
        <LogoutButton />
      </div>

      {/* Menú Desplegable (Mobile) */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg flex flex-col p-2 gap-1 z-50 md:hidden">
          <Link
            href="/admin/perfil"
            onClick={() => setIsOpen(false)}
            className="px-4 py-3 text-base min-h-[44px] flex items-center text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            Perfil
          </Link>
          <Link
            href="/admin/dashboard/categorias"
            onClick={() => setIsOpen(false)}
            className="px-4 py-3 text-base min-h-[44px] flex items-center text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            Categorías
          </Link>
          <div className="border-t border-gray-100 my-1"></div>
          <div className="px-2 pb-1 pt-1" onClick={() => setIsOpen(false)}>
             <LogoutButton />
          </div>
        </div>
      )}
    </div>
  )
}
