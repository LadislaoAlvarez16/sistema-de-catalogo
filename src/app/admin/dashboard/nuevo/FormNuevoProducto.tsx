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
        <form action={formAction} className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-5">
            {state?.error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                    {state.error}
                </div>
            )}

            <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-1">Nombre</label>
                <input type="text" id="name" name="name" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 bg-white" />
            </div>

            <div>
                <label htmlFor="category_id" className="block text-sm font-semibold text-gray-800 mb-1">Categoría</label>
                <select
                    id="category_id"
                    name="category_id"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 bg-white"
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
                <label htmlFor="price" className="block text-sm font-semibold text-gray-800 mb-1">Precio</label>
                <input type="number" id="price" name="price" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 bg-white" />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-1">Descripción (Opcional)</label>
                <textarea id="description" name="description" rows={3} placeholder="Detalles de la llave..." className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 bg-white"></textarea>
            </div>

            <div>
                <label htmlFor="image" className="block text-sm font-semibold text-gray-800 mb-1">Imagen</label>
                <label htmlFor="image" className="block border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer text-gray-600">
                    Haz clic para seleccionar una imagen
                </label>
                <input type="file" id="image" name="image" accept="image/*" className="hidden" />
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                <Link href="/admin/dashboard" className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2 rounded-lg">Cancelar</Link>
                <button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium shadow-sm">Guardar</button>
            </div>
        </form>
    );
}