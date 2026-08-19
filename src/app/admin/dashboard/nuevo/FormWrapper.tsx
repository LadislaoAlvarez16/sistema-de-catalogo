"use client"

import { useActionState, useEffect, useState } from 'react'
import { createProductAction } from './actions'
import FormNuevoProducto from './FormNuevoProducto'

interface Categoria {
    id: string;
    name: string;
}

export default function FormWrapper({ categorias }: { categorias: Categoria[] }) {
    const [state, formAction, isPending] = useActionState(createProductAction, { error: '' })
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
                formAction={formAction}
                state={state as { error: string; success?: boolean }}
                isLoading={isPending}
            />
        </>
    )
}