"use client"

import { useActionState, startTransition, useEffect, useState } from 'react'
import { createProductAction } from './actions'
import FormNuevoProducto from './FormNuevoProducto'
import imageCompression from 'browser-image-compression'

interface Categoria {
    id: string;
    name: string;
}

export default function FormWrapper({ categorias }: { categorias: Categoria[] }) {
    const [state, formAction] = useActionState(createProductAction, { error: '' })
    const [showSuccess, setShowSuccess] = useState(false)
    const [formKey, setFormKey] = useState(() => Date.now()) // <-- Inicialización lazy que arreglamos antes

    useEffect(() => {
        if (state?.success) {

            const showTimer = setTimeout(() => {
                setShowSuccess(true)
                setFormKey(Date.now())
            }, 10)

            const hideTimer = setTimeout(() => {
                setShowSuccess(false)
            }, 4000)

            return () => {
                clearTimeout(showTimer)
                clearTimeout(hideTimer)
            }
        }
    }, [state])

    const handleAction = async (formData: FormData) => {
        const imageFile = formData.get('image') as File | null;

        if (imageFile && imageFile.size > 0) {
            try {
                // Solo dejamos la configuración y la compresión en el cliente, sin tocar el formData original hasta que tengamos el archivo comprimido
                const options = {
                    maxSizeMB: 0.3,
                    maxWidthOrHeight: 1080,
                    useWebWorker: true,
                };

                const compressedFile = await imageCompression(imageFile, options);
                formData.set('image', compressedFile, compressedFile.name);
            } catch (error) {
                console.error('Error al comprimir la imagen:', error);
            }
        }

        // Envolvemos el envío en startTransition
        startTransition(() => {
            formAction(formData);
        });
    }

    return (
        <>
            {showSuccess && (
                <div className="mb-4 rounded-lg bg-emerald-100 px-4 py-3 text-emerald-800 shadow-sm shadow-emerald-200 transition-all">
                    ✅ Producto creado con éxito.
                </div>
            )}

            <FormNuevoProducto
                key={formKey}
                categorias={categorias}
                formAction={handleAction}
                state={state as { error: string; success?: boolean }}
            />
        </>
    )
}