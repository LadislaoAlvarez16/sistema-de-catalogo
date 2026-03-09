"use client"

import Link from 'next/link'

interface Categoria {
    id: string;
    name: string;
}

export default function FormNuevoProducto({
    categorias,
    formAction,
    state
}: {
    categorias: Categoria[],
    formAction: (payload: FormData) => void,
    state: { error: string }
}) {
    return (
        <form action={formAction} className="bg-white p-6 rounded shadow space-y-5">
            {state?.error && (
                <div className="bg-red-100 text-red-700 p-2 rounded text-sm text-center">
                    {state.error}
                </div>
            )}

            <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1 text-zinc-700">Nombre</label>
                <input type="text" id="name" name="name" required className="w-full border border-gray-300 rounded px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
                <label htmlFor="category_id" className="block text-sm font-medium mb-1 text-zinc-700">Categoría</label>
                <select
                    id="category_id"
                    name="category_id"
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                        const selectedText = e.target.options[e.target.selectedIndex].text;
                        const hiddenInput = document.getElementById('category_name') as HTMLInputElement;
                        if (hiddenInput) hiddenInput.value = selectedText;
                    }}
                >
                    <option value="">Seleccionar...</option>
                    {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                <input type="hidden" id="category_name" name="category_name" />
            </div>

            <div>
                <label htmlFor="price" className="block text-sm font-medium mb-1 text-zinc-700">Precio</label>
                <input type="number" id="price" name="price" required className="w-full border border-gray-300 rounded px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1 text-zinc-700">Descripción (Opcional)</label>
                <textarea id="description" name="description" rows={3} placeholder="Detalles de la llave..." className="w-full border border-gray-300 rounded px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>

            <div>
                <label htmlFor="image" className="block text-sm font-medium mb-1 text-zinc-700">Imagen</label>
                <input type="file" id="image" name="image" accept="image/*" className="w-full text-zinc-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>

            <div className="flex justify-between items-center pt-4">
                <Link href="/admin/dashboard" className="text-blue-600 hover:underline text-sm">Cancelar</Link>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition">Guardar</button>
            </div>
        </form>
    );
}