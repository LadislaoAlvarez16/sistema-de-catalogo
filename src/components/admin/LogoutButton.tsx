'use client'

import { LogOut } from 'lucide-react'
import { logoutAction } from '@/app/admin/dashboard/actions'

export default function LogoutButton() {
  const handleLogout = async () => {
    // Invocamos la Server Action limpia
    const result = await logoutAction()
    
    // Evaluamos si retornó un error y lo mostramos al usuario
    if (result?.error) {
      alert(result.error)
      console.error(result.error)
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
      title="Cerrar sesión"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline">Salir</span>
    </button>
  )
}
