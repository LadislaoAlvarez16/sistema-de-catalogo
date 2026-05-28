"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateAccountSettings(prevState: unknown, formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: "No autorizado" }
    }

    const { data: account } = await supabase
        .from('accounts')
        .select('id')
        .eq('user_id', user.id)
        .single()
        
    if (!account) {
        return { error: "Cuenta no encontrada" }
    }

    const name = formData.get("name") as string
    const slug = formData.get("slug") as string
    const description = formData.get("description") as string
    const whatsapp = formData.get("whatsapp") as string

    // Limpieza final de slug en el backend por seguridad
    const cleanSlug = slug?.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-')

    const { error } = await supabase
        .from('accounts')
        .update({ name, slug: cleanSlug, description, whatsapp })
        .eq('id', account.id)

    if (error) {
        // Interceptamos el código 23505 (Unique Violation en Postgres)
        if (error.code === '23505') {
            return { error: "Ese enlace de catálogo ya está siendo utilizado por otro comercio. Por favor, elegí uno distinto." }
        }
        return { error: error.message }
    }

    revalidatePath('/admin/perfil')
    revalidatePath('/', 'layout')
    
    return { success: true, message: "Configuración actualizada correctamente" }
}
