"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createCategoryFastAction } from './actions'
import { Loader2 } from 'lucide-react'

import { compressImage } from '@/lib/image-compression'

interface Categoria {
    id: string;
    name: string;
}

export default function FormNuevoProducto({
    categorias,
    formAction,
    state,
    isLoading
}: {
    categorias: Categoria[],
    formAction: (payload: FormData) => void,
    state: { error: string },
    isLoading?: boolean
}) {
    const [fileName, setFileName] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);
    
    // Limpieza de memoria (evitar memory leaks con URL.createObjectURL)
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);
    
    // Estados para la nueva categoría
    const [localCategorias, setLocalCategorias] = useState(categorias);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [isSavingCategory, setIsSavingCategory] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        
        setImageError(null);

        // Liberamos la URL anterior si el usuario selecciona otro archivo antes de enviar
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

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;
        setIsSavingCategory(true);
        const result = await createCategoryFastAction(newCategoryName);
        setIsSavingCategory(false);
        if (result.error) {
            alert(result.error);
            return;
        }
        if (result.data) {
            setLocalCategorias([...localCategorias, result.data]);
            setSelectedCategoryId(result.data.id);
            setIsModalOpen(false);
            setNewCategoryName("");
            
            // Forzar actualización del campo oculto ya que se usa en el submit
            const hiddenInput = document.getElementById('category_name') as HTMLInputElement;
            if (hiddenInput) hiddenInput.value = result.data.name;
        }
    }

    return (
        <>
            <form action={formAction} className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-5 relative z-0">
                {state?.error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                        {state.error}
                    </div>
                )}

                <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-1">Nombre</label>
                    <input type="text" id="name" name="name" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 bg-white text-base sm:text-sm" />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="category_id" className="block text-sm font-semibold text-gray-800">Categoría</label>
                        <button 
                            type="button" 
                            onClick={() => setIsModalOpen(true)} 
                            disabled={isLoading}
                            className={`text-sm font-medium ${isLoading ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
                        >
                            + Nueva
                        </button>
                    </div>
                    <select
                        id="category_id"
                        name="category_id"
                        required
                        value={selectedCategoryId}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 bg-white text-base sm:text-sm"
                        onChange={(e) => {
                            setSelectedCategoryId(e.target.value);
                            const selectedText = e.target.options[e.target.selectedIndex].text;
                            const hiddenInput = document.getElementById('category_name') as HTMLInputElement;
                            if (hiddenInput) hiddenInput.value = selectedText;
                        }}
                    >
                        <option value="">Seleccionar...</option>
                        {localCategorias.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <input type="hidden" id="category_name" name="category_name" />
                </div>

                <div>
                    <label htmlFor="price" className="block text-sm font-semibold text-gray-800 mb-1">Precio</label>
                    <input type="number" id="price" name="price" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 bg-white text-base sm:text-sm" />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-1">Descripción (Opcional)</label>
                    <textarea id="description" name="description" rows={3} placeholder="Detalles..." className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 bg-white text-base sm:text-sm"></textarea>
                </div>

                <div>
                    <label htmlFor="image" className="block text-sm font-semibold text-gray-800 mb-1">Imagen</label>
                    <label htmlFor="image" className="block border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer text-gray-600 overflow-hidden relative">
                        {previewUrl ? (
                            <div className="flex flex-col items-center gap-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={previewUrl} alt="Previsualización" className="h-32 object-contain rounded-md" />
                                <span className="text-sm font-medium">Cambiar imagen ({fileName})</span>
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
                    <Link href="/admin/dashboard" className={`bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-lg font-medium transition-colors ${isLoading || isCompressing ? 'pointer-events-none opacity-50' : ''}`}>Cancelar</Link>
                    <button 
                        type="submit" 
                        disabled={isLoading || !!imageError || isCompressing}
                        className={`bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center justify-center gap-2 ${isLoading || imageError || isCompressing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800'}`}
                    >
                        {isCompressing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Optimizando imagen...
                            </>
                        ) : isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Procesando...
                            </>
                        ) : (
                            'Guardar'
                        )}
                    </button>
                </div>
            </form>

            {/* Modal de nueva categoría */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Nueva Categoría</h3>
                        <input 
                            type="text" 
                            placeholder="Ej. Llaveros, Accesorios..." 
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleCreateCategory();
                                }
                            }}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 bg-white text-base sm:text-sm mb-6"
                            autoFocus
                        />
                        <div className="flex justify-end gap-3">
                            <button 
                                type="button" 
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="button" 
                                onClick={handleCreateCategory}
                                disabled={isSavingCategory || !newCategoryName.trim()}
                                className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
                            >
                                {isSavingCategory ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}