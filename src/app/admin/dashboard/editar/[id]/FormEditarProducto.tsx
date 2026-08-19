"use client"

import Link from 'next/link'
import { useState, useEffect, useActionState } from 'react'
import { Loader2 } from 'lucide-react'
import { compressImage } from '@/lib/image-compression'

interface Categoria {
    id: string;
    name: string;
}

interface Product {
    name: string;
    category_id?: string;
    category?: string;
    price: number | null;
    description?: string;
    image_url?: string;
}

export default function FormEditarProducto({
    product,
    categorias,
    action
}: {
    product: Product,
    categorias: Categoria[],
    action: (prevState: unknown, payload: FormData) => Promise<{ error?: string; success?: boolean }>
}) {
    const [fileName, setFileName] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);
    
    const [state, formAction, isPending] = useActionState(action, { error: '' })

    // Limpieza de memoria (evitar memory leaks con URL.createObjectURL)
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        
        setImageError(null);

        // Liberamos la URL anterior si el usuario selecciona otro archivo
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
            if (!validTypes.includes(file.type) && !file.type.startsWith('image/')) {
                setImageError("El archivo debe ser una imagen válida");
                e.target.value = '';
                setFileName(null);
                setPreviewUrl(null);
                return;
            }

            setIsCompressing(true);
            try {
                const compressedFile = await compressImage(file);
                
                // Actualizar el input con el archivo comprimido
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(compressedFile);
                e.target.files = dataTransfer.files;

                const MAX_SIZE = 4.5 * 1024 * 1024;
                if (compressedFile.size > MAX_SIZE) {
                    setImageError("La imagen no debe superar los 4.5 MB tras la compresión");
                    e.target.value = '';
                    setFileName(null);
                    setPreviewUrl(null);
                    return;
                }

                setFileName(compressedFile.name);
                setPreviewUrl(URL.createObjectURL(compressedFile));
            } catch (error) {
                console.error("Error comprimiendo imagen", error);
                setImageError("Hubo un error al optimizar la imagen");
                e.target.value = '';
                setFileName(null);
                setPreviewUrl(null);
            } finally {
                setIsCompressing(false);
            }
        } else {
            setFileName(null);
            setPreviewUrl(null);
        }
    };

    const currentDisplayImage = previewUrl || product.image_url;

    return (
        <form action={formAction} className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-5 relative z-0">
            {state?.error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                    {state.error}
                </div>
            )}
            
            <input type="hidden" name="current_image_url" value={product.image_url || ''} />

            <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-1">Nombre del producto</label>
                <input type="text" id="name" name="name" defaultValue={product.name} placeholder="Ej: Producto de prueba" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 bg-white text-base sm:text-sm" />
            </div>

            <div>
                <label htmlFor="category_id" className="block text-sm font-semibold text-gray-800 mb-1">Categoría</label>
                <select
                    id="category_id"
                    name="category_id"
                    defaultValue={product.category_id || ''}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 bg-white text-base sm:text-sm"
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
                <input type="hidden" id="category_name" name="category_name" defaultValue={product.category || ''} />
            </div>

            <div>
                <label htmlFor="price" className="block text-sm font-semibold text-gray-800 mb-1">Precio del producto (Opcional)</label>
                <input type="number" id="price" name="price" defaultValue={product.price ?? ''} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 bg-white text-base sm:text-sm" />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-1">Descripción</label>
                <textarea id="description" name="description" rows={3} defaultValue={product.description || ''} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 bg-white text-base sm:text-sm"></textarea>
            </div>

            <div>
                <label htmlFor="image" className="block text-sm font-semibold text-gray-800 mb-1">Imagen del Producto</label>
                {product.image_url && !previewUrl && <p className="text-xs text-gray-500 mb-2">Este producto ya tiene una foto. Subí un archivo nuevo solo si querés reemplazarla.</p>}
                <label htmlFor="image" className="block border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer text-gray-600 overflow-hidden relative">
                    {currentDisplayImage ? (
                        <div className="flex flex-col items-center gap-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={currentDisplayImage} alt="Previsualización" className="h-32 object-contain rounded-md" />
                            <span className="text-sm font-medium">{fileName ? `Cambiar imagen (${fileName})` : "Cambiar imagen"}</span>
                        </div>
                    ) : (
                        <span>Haz clic para seleccionar una imagen</span>
                    )}
                </label>
                <input type="file" id="image" name="image" accept="image/*" className="hidden" onChange={handleFileChange} />
                {imageError && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{imageError}</p>
                )}
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                <Link href="/admin/dashboard" className={`bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-lg font-medium transition-colors ${isPending || isCompressing ? 'pointer-events-none opacity-50' : ''}`}>Cancelar</Link>
                <button 
                    type="submit" 
                    disabled={isPending || !!imageError || isCompressing}
                    className={`bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center justify-center gap-2 ${isPending || imageError || isCompressing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800'}`}
                >
                    {isCompressing ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Optimizando imagen...
                        </>
                    ) : isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Procesando...
                        </>
                    ) : (
                        'Actualizar'
                    )}
                </button>
            </div>
        </form>
    )
}