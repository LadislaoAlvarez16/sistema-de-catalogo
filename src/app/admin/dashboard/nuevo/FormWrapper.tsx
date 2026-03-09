"use client"

import { useActionState } from 'react'
import { createProductAction } from './actions'
import FormNuevoProducto from './FormNuevoProducto'

interface Categoria {
    id: string;
    name: string;
}

export default function FormWrapper({ categorias }: { categorias: Categoria[] }) {
    // Acá inicializamos el hook que maneja el estado del formulario y los errores
    const [state, formAction] = useActionState(createProductAction, { error: '' })

    return (
        <FormNuevoProducto
            categorias={categorias}
            formAction={formAction}
            state={state as { error: string }}
        />
    )
}