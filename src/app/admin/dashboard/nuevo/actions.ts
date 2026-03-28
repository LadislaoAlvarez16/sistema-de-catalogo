"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { PLAN_RULES, type Plan } from '@/lib/plan/plan.config'

export async function createProductAction(prevState: unknown, formData: FormData) {
    const name = formData.get('name') as string
    const category_id = formData.get('category_id') as string | null
    const category_name = formData.get('category_name') as string | null
    const price = parseFloat(formData.get('price') as string)
    const description = formData.get('description') as string | null
    const image = formData.get('image') as File | null

    // Si no hay categoría, guardar null en ambas
    const categoryIdToSave = category_id && category_id !== "" ? category_id : null
    const categoryNameToSave = category_name && category_name !== "" ? category_name : null

    if (!name || isNaN(price)) {
        return { error: 'Faltan campos obligatorios' }
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

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
            return { error: 'No se pudo subir la imagen' }
        }

        const { data: publicUrlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName)

        image_url = publicUrlData.publicUrl
    }

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
        return { error: insertError.message }
    }

    revalidatePath('/admin/dashboard')
    redirect('/admin/dashboard')
}