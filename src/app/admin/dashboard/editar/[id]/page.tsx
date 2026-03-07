import { createClient } from '@/lib/supabase/server'
import { updateProductAction } from './actions'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    // 1. Buscamos los datos actuales del producto
    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (!product) notFound()

    // 2. Conectamos el ID del producto con la acción del formulario
    const updateActionWithId = updateProductAction.bind(null, id)

    return (
        <div className="max-w-md mx-auto py-10 px-4 text-white">
            <h1 className="text-2xl font-bold mb-6 text-center">Editar producto</h1>

            <form action={updateActionWithId} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow space-y-5">
                {/* Campo oculto para no perder la imagen vieja si no sube una nueva */}
                <input type="hidden" name="current_image_url" value={product.image_url || ''} />

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1">Nombre</label>
                    <input type="text" id="name" name="name" defaultValue={product.name} required className="w-full border border-zinc-700 bg-zinc-950 text-white rounded px-3 py-2 focus:outline-none focus:border-blue-500" />
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-zinc-300 mb-1">Categoría</label>
                    <input type="text" id="category" name="category" defaultValue={product.category} required className="w-full border border-zinc-700 bg-zinc-950 text-white rounded px-3 py-2 focus:outline-none focus:border-blue-500" />
                </div>

                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-zinc-300 mb-1">Precio</label>
                    <input type="number" id="price" name="price" defaultValue={product.price} required className="w-full border border-zinc-700 bg-zinc-950 text-white rounded px-3 py-2 focus:outline-none focus:border-blue-500" />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-1">Descripción</label>
                    <textarea id="description" name="description" rows={3} defaultValue={product.description || ''} className="w-full border border-zinc-700 bg-zinc-950 text-white rounded px-3 py-2 focus:outline-none focus:border-blue-500"></textarea>
                </div>

                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-zinc-300 mb-1">Nueva Imagen (Opcional)</label>
                    {product.image_url && <p className="text-xs text-zinc-500 mb-2">Este producto ya tiene una foto. Subí un archivo nuevo solo si querés reemplazarla.</p>}
                    <input type="file" id="image" name="image" accept="image/*" className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700" />
                </div>

                <div className="flex justify-between items-center pt-4">
                    <Link href="/admin/dashboard" className="text-blue-500 hover:underline text-sm">
                        Cancelar
                    </Link>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition">
                        Actualizar
                    </button>
                </div>
            </form>
        </div>
    )
}