'use client'

import { useTransition } from 'react'

import { deleteProductServerAction } from '@/app/admin/dashboard/actions'

interface DeleteProductButtonProps {
    productId: string
}

export default function DeleteProductButton({ productId }: DeleteProductButtonProps) {
    const [isDeleting, startTransition] = useTransition()

    const handleDelete = () => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            startTransition(async () => {
                try {
                    await deleteProductServerAction(productId)
                } catch (error) {
                    console.error('Error al eliminar el producto:', error)
                    alert('Error al eliminar el producto. Inténtalo de nuevo.')
                }
            })
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </button>
    )
}