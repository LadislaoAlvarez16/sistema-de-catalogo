'use client'

import { useState, useTransition } from 'react'
import { toggleProductVisibilityAction } from '@/app/admin/dashboard/actions'
import { Eye, EyeOff } from 'lucide-react'

export default function ToggleProductVisibility({ 
    productId, 
    initialIsActive 
}: { 
    productId: string
    initialIsActive: boolean 
}) {
    const [isPending, startTransition] = useTransition()
    const [isActive, setIsActive] = useState(initialIsActive)

    const handleToggle = () => {
        setIsActive(!isActive)
        startTransition(async () => {
            try {
                await toggleProductVisibilityAction(productId, isActive)
            } catch (error) {
                console.error("Error toggling product visibility", error)
                // Revert state if failed
                setIsActive(isActive)
            }
        })
    }

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            title={isActive ? "Ocultar producto" : "Mostrar producto"}
            className={`flex items-center justify-center p-2 rounded-md transition-colors ${
                isActive 
                    ? 'text-green-600 hover:bg-green-50' 
                    : 'text-gray-400 hover:bg-gray-100'
            } disabled:opacity-50`}
        >
            {isActive ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
        </button>
    )
}
