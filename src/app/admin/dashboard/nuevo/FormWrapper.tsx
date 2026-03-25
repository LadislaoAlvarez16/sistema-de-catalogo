"use client"

// Agregamos startTransition en la importación
import { useActionState, startTransition } from 'react'
import { createProductAction } from './actions'
import FormNuevoProducto from './FormNuevoProducto'
import imageCompression from 'browser-image-compression'

interface Categoria {
    id: string;
    name: string;
}

export default function FormWrapper({ categorias }: { categorias: Categoria[] }) {
    const [state, formAction] = useActionState(createProductAction, { error: '' })

    const handleAction = async (formData: FormData) => {
        const imageFile = formData.get('image') as File | null;

        if (imageFile && imageFile.size > 0) {
            try {
                console.log('Tamaño original:', (imageFile.size / 1024 / 1024).toFixed(2), 'MB');

                const options = {
                    maxSizeMB: 0.3,
                    maxWidthOrHeight: 1080,
                    useWebWorker: true,
                };

                const compressedFile = await imageCompression(imageFile, options);
                console.log('Tamaño comprimido:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');

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
        <FormNuevoProducto
            categorias={categorias}
            formAction={handleAction}
            state={state as { error: string }}
        />
    )
}