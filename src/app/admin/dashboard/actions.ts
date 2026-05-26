'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function logoutAction() {
    const supabase = await createClient()
    
    // Eliminamos la sesión actual del usuario (borrado de cookies) de forma segura
    const { error } = await supabase.auth.signOut()

    if (error) {
        return { error: `Error al cerrar sesión: ${error.message}` }
    }

    // Si es exitoso, redirigimos inmediatamente a la página de login
    redirect('/admin/login')
}

export async function deleteProductServerAction(productId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

    if (error) {
        throw new Error(`Error al eliminar el producto: ${error.message}`)
    }

    revalidatePath('/admin/dashboard')
    revalidatePath('/[account]', 'page')
}

export async function toggleProductVisibilityAction(productId: string, currentStatus: boolean) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('products')
        .update({ active: !currentStatus })
        .eq('id', productId)

    if (error) {
        throw new Error(`Error al actualizar estado: ${error.message}`)
    }

    revalidatePath('/admin/dashboard')
    revalidatePath('/[account]', 'page')
}