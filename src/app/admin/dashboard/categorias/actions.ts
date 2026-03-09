"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addCategoryAction(formData: FormData) {
    const name = formData.get('name') as string
    if (!name) return

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Buscamos la cuenta de Pepe
    const { data: account } = await supabase
        .from('accounts')
        .select('id')
        .eq('user_id', user?.id)
        .single()

    if (!account) throw new Error("Cuenta no encontrada")

    // Generamos un slug limpio (ej: "Cajas Fuertes" -> "cajas-fuertes")
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    // Guardamos en la base de datos
    await supabase.from('categories').insert({
        name,
        slug,
        account_id: account.id
    })

    // Actualizamos las vistas
    revalidatePath('/admin/dashboard/categorias')
    revalidatePath('/admin/dashboard/nuevo')
}

export async function deleteCategoryAction(formData: FormData) {
    const id = formData.get('id') as string
    const supabase = await createClient()

    await supabase.from('categories').delete().eq('id', id)

    revalidatePath('/admin/dashboard/categorias')
    revalidatePath('/admin/dashboard/nuevo')
}