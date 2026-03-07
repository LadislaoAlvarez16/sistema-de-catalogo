"use client"

import { useActionState } from 'react'
import { createProductAction } from './actions'
import Link from 'next/link'

export default function NuevoProductoPage() {
    const [state, formAction] = useActionState(createProductAction, { error: '' })

    return (
        <div className="max-w-md mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-6 text-center">Agregar nuevo producto</h1>
            <form action={formAction} className="bg-white p-6 rounded shadow space-y-5">
                {state?.error && (
                    <div className="bg-red-100 text-red-700 p-2 rounded text-sm text-center">
                        {state.error}
                    </div>
                )}

                <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Nombre</label>
                    <input type="text" id="name" name="name" required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium mb-1">Categoría</label>
                    <input type="text" id="category" name="category" required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                    <label htmlFor="price" className="block text-sm font-medium mb-1">Precio</label>
                    <input type="number" id="price" name="price" required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                {/* --- LOS CAMPOS NUEVOS --- */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">Descripción (Opcional)</label>
                    <textarea id="description" name="description" rows={3} placeholder="Detalles de la llave o producto..." className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>

                <div>
                    <label htmlFor="image" className="block text-sm font-medium mb-1">Imagen del Producto</label>
                    <input type="file" id="image" name="image" accept="image/*" className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>

                <div className="flex justify-between items-center pt-4">
                    <Link href="/admin/dashboard" className="text-blue-600 hover:underline text-sm">
                        Cancelar
                    </Link>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    )
}