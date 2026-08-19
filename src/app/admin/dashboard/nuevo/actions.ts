"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { PLAN_RULES, type Plan } from '@/lib/plan/plan.config'
import { generateUniqueSlug } from '@/utils/slug'

export async function createProductAction(prevState: unknown, formData: FormData) {
    const name = formData.get('name') as string
    const category_id = formData.get('category_id') as string | null
    const category_name = formData.get('category_name') as string | null
    const priceRaw = formData.get('price') as string
    const price = priceRaw && priceRaw.trim() !== "" ? parseFloat(priceRaw) : null
    const description = formData.get('description') as string | null
    const image = formData.get('image') as File | null

    // Si no hay categoría, guardar null en ambas
    const categoryIdToSave = category_id && category_id !== "" ? category_id : null
    const categoryNameToSave = category_name && category_name !== "" ? category_name : null

    if (!name) {
        return { error: 'Faltan campos obligatorios' }
    }



    const supabase = await createClient()

    // Obtener el usuario y su cuenta
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'No autorizado' }

    //Lógica de seguridad en el backend 
    const { data: accountData, error: accountError } = await supabase
        .from('accounts')
        .select('id, plan')
        .eq('user_id', user.id)
        .single()

    if (accountError || !accountData) return { error: 'No se encontró la cuenta del negocio' }

    //Lógica de seguridad en el backend 
    const currentPlan = (accountData.plan as Plan) || 'basic'
    const limit = PLAN_RULES[currentPlan].productLimit

    // Contamos cuántos productos tiene esta cuenta antes de dejarlo seguir
    const { count } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('account_id', accountData.id)

    // Si llegó o pasó el límite, cortamos todo ANTES de subir la imagen
    if (count !== null && count >= limit) {
        return { error: `Límite alcanzado: El plan ${currentPlan === 'basic' ? 'Básico' : currentPlan} permite hasta ${limit} productos. Contactanos para ampliar.` }
    }

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
        // --- Si pasa el control, recién ahí procesamos la imagen ---
        let image_url = null

        if (image && image.size > 0) {
            const fileExt = image.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(fileName, image)

            if (uploadError) {
                console.error("Error subiendo imagen:", uploadError)
                return { error: 'No se pudo subir la imagen', success: false }
            }

            const { data: publicUrlData } = supabase.storage
                .from('product-images')
                .getPublicUrl(fileName)

            image_url = publicUrlData.publicUrl
        }

        const slug = await generateUniqueSlug(supabase, name, accountData.id)

        // Guardar en la tabla products
        const { error: insertError } = await supabase
            .from('products')
            .insert({
                name,
                slug,
                category_id: categoryIdToSave,
                category: categoryNameToSave,
                price,
                description: description || null,
                image_url,
                account_id: accountData.id
            })

        if (insertError) {
            console.error("Error insertando producto:", insertError)
            return { error: insertError.message, success: false }
        }

        revalidatePath('/admin/dashboard')
        revalidatePath('/[account]', 'page')

        return { error: '', success: true }
    } catch (e: unknown) {
        console.error("Error inesperado en createProductAction:", e)
        return { error: 'Ocurrió un error inesperado al guardar el producto', success: false }
    }
}

export async function createCategoryFastAction(name: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'No autorizado' }

    const { data: accountData } = await supabase
        .from('accounts')
        .select('id')
        .eq('user_id', user.id)
        .single()
    
    if (!accountData) return { error: 'No se encontró la cuenta' }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    const { data, error } = await supabase
        .from('categories')
        .insert({
            name,
            slug,
            account_id: accountData.id
        })
        .select('id, name')
        .single()

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/dashboard/nuevo')
    return { data }
}