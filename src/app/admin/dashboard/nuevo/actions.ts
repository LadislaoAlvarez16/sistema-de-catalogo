"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProductAction(prevState: unknown, formData: FormData) {
    // 1. Extraer los datos del formulario
    const name = formData.get('name') as string
    const category = formData.get('category') as string
    const price = parseFloat(formData.get('price') as string)
    const description = formData.get('description') as string | null
    const image = formData.get('image') as File | null

    if (!name || !category || isNaN(price)) {
        return { error: 'Faltan campos obligatorios' }
    }

    // 2. Generar slug automático (ej: "Llave Yale" -> "llave-yale")
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    const supabase = await createClient()

    // 3. Obtener el usuario y su cuenta
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'No autorizado' }

    const { data: accountData, error: accountError } = await supabase
        .from('accounts')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (accountError || !accountData) return { error: 'No se encontró la cuenta del negocio' }

    let image_url = null

    // 4. Subir la imagen a Supabase Storage (si el usuario eligió una)
    if (image && image.size > 0) {
        // Inventar un nombre único para que no se sobreescriban fotos con el mismo nombre
        const fileExt = image.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from('product-images') // Usamos tu bucket existente
            .upload(fileName, image)

        if (uploadError) {
            console.error("Error subiendo imagen:", uploadError)
            return { error: 'No se pudo subir la imagen' }
        }

        // Obtener el link público para guardarlo en la base de datos
        const { data: publicUrlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName)

        image_url = publicUrlData.publicUrl
    }

    // 5. Guardar todo en la tabla products
    const { error: insertError } = await supabase
        .from('products')
        .insert({
            name,
            slug,
            category,
            price,
            description: description || null,
            image_url,
            account_id: accountData.id
        })

    if (insertError) {
        console.error("Error insertando producto:", insertError)
        return { error: insertError.message }
    }

    // 6. Refrescar el panel y volver
    revalidatePath('/admin/dashboard')
    redirect('/admin/dashboard')
}