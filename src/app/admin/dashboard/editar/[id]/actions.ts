"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProductAction(productId: string, formData: FormData) {
    const name = formData.get('name') as string
    const category = formData.get('category') as string
    const price = parseFloat(formData.get('price') as string)
    const description = formData.get('description') as string | null
    const image = formData.get('image') as File | null
    const currentImageUrl = formData.get('current_image_url') as string | null

    if (!name || !category || isNaN(price)) {
        throw new Error('Faltan campos obligatorios')
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    const supabase = await createClient()

    let image_url = currentImageUrl

    // Si subió una foto nueva, eliminamos la anterior (si corresponde), guardamos la nueva y actualizamos la URL
    if (image && image.size > 0) {
        // Eliminar imagen anterior si la URL es válida de Supabase
        if (
            currentImageUrl &&
            typeof currentImageUrl === 'string' &&
            currentImageUrl.includes('rvmxxlwnrlbbfihhblmy.supabase.co/storage/v1/object/public/product-images/')
        ) {
            const parts = currentImageUrl.split('/')
            const oldFileName = parts[parts.length - 1]
            if (oldFileName) {
                await supabase.storage.from('product-images').remove([oldFileName])
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
        }
    }

    // Actualizamos el registro en la base de datos
    const { error } = await supabase
        .from('products')
        .update({ name, slug, category, price, description, image_url })
        .eq('id', productId)

    if (error) throw new Error(error.message)

    revalidatePath('/admin/dashboard')
    redirect('/admin/dashboard')
}