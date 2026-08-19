"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { generateUniqueSlug } from '@/utils/slug'

export async function updateProductAction(productId: string, prevState: unknown, formData: FormData) {
    const name = formData.get('name') as string
    const category_id = formData.get('category_id') as string // <-- NUEVO
    const category_name = formData.get('category_name') as string // <-- NUEVO
    const priceRaw = formData.get('price') as string
    const price = priceRaw && priceRaw.trim() !== "" ? parseFloat(priceRaw) : null
    const description = formData.get('description') as string | null
    const image = formData.get('image') as File | null
    const currentImageUrl = formData.get('current_image_url') as string | null

    if (!name || !category_id) {
        return { error: 'Faltan campos obligatorios', success: false }
    }

    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'No autorizado', success: false }

    const { data: accountData, error: accountError } = await supabase
        .from('accounts')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (accountError || !accountData) return { error: 'No se encontró la cuenta del negocio', success: false }
    const accountId = accountData.id

    const slug = await generateUniqueSlug(supabase, name, accountId, productId)

    // --- Validación de imagen en el servidor ---
    if (image && image.size > 0) {
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(image.type)) {
            return { error: 'La imagen debe ser formato JPEG, PNG o WEBP', success: false }
        }

        const MAX_SIZE = 4.5 * 1024 * 1024;
        if (image.size > MAX_SIZE) {
            return { error: 'La imagen no debe superar los 4.5 MB', success: false }
        }
    }

    try {
        let image_url = currentImageUrl

        if (image && image.size > 0) {
            if (currentImageUrl && typeof currentImageUrl === 'string') {
                try {
                    const url = new URL(currentImageUrl)
                    const parts = url.pathname.split('/')
                    const oldFileName = parts[parts.length - 1]
                    if (oldFileName) {
                        await supabase.storage.from('product-images').remove([oldFileName])
                    }
                } catch (e: unknown) {
                    console.error('Error parseando imagen antigua a eliminar:', e)
                }
            }

            const fileExt = image.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(fileName, image)

            if (!uploadError) {
                const { data } = supabase.storage.from('product-images').getPublicUrl(fileName)
                image_url = data.publicUrl
            } else {
                return { error: 'No se pudo subir la nueva imagen', success: false }
            }
        }

        const { error } = await supabase
            .from('products')
            .update({
                name,
                slug,
                category_id,
                category: category_name,
                price,
                description,
                image_url
            })
            .eq('id', productId)
            .eq('account_id', accountId)

        if (error) return { error: error.message, success: false }
        
        revalidatePath('/admin/dashboard')
        revalidatePath('/[account]', 'page')
    } catch (e: unknown) {
        console.error("Error inesperado en updateProductAction:", e)
        return { error: 'Ocurrió un error inesperado al actualizar el producto', success: false }
    }

    revalidatePath('/admin/dashboard')
    revalidatePath('/[account]', 'page')
    redirect('/admin/dashboard')
}