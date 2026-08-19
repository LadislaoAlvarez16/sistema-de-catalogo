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

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { success: false, error: 'No autorizado' }
    }

    const { data: account } = await supabase.from('accounts').select('id, slug').eq('user_id', user.id).single()
    if (!account) {
        return { success: false, error: 'Cuenta no encontrada' }
    }

    const { data: product } = await supabase.from('products').select('image_url').eq('id', productId).eq('account_id', account.id).single()

    if (!product) {
        return { success: false, error: 'Producto no encontrado' }
    }

    if (product.image_url) {
        try {
            const url = new URL(product.image_url)
            const pathParts = url.pathname.split('/')
            const fileName = pathParts[pathParts.length - 1]
            if (fileName) {
                await supabase.storage.from('product-images').remove([fileName])
            }
        } catch (e: unknown) {
            console.error('Error al parsear URL de imagen:', e)
        }
    }

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .eq('account_id', account.id)

    if (error) {
        return { success: false, error: `Error al eliminar el producto: ${error.message}` }
    }

    revalidatePath('/admin/dashboard')
    revalidatePath(`/${account.slug}`, 'page')

    return { success: true }
}

export async function toggleProductVisibilityAction(productId: string, currentStatus: boolean) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { success: false, error: 'No autorizado' }
    }

    const { data: account } = await supabase.from('accounts').select('id, slug').eq('user_id', user.id).single()
    if (!account) {
        return { success: false, error: 'Cuenta no encontrada' }
    }

    const { error } = await supabase
        .from('products')
        .update({ active: !currentStatus })
        .eq('id', productId)
        .eq('account_id', account.id)

    if (error) {
        return { success: false, error: `Error al actualizar estado: ${error.message}` }
    }

    revalidatePath('/admin/dashboard')
    revalidatePath(`/${account.slug}`, 'page')

    return { success: true }
}