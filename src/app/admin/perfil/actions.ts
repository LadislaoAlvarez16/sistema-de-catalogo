"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { canUseCustomDomain } from '@/lib/plan/plan.helpers'
import type { Plan } from '@/lib/plan/plan.config'
import type { TablesUpdate } from '@/lib/database.types'

export async function updateAccountSettings(prevState: unknown, formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: "No autorizado" }
    }

    const { data: account } = await supabase
        .from('accounts')
        .select('id, plan')
        .eq('user_id', user.id)
        .single()
        
    if (!account) {
        return { error: "Cuenta no encontrada" }
    }

    const name = formData.get("name") as string
    const slug = formData.get("slug") as string
    const description = formData.get("description") as string
    const whatsapp = formData.get("whatsapp") as string
    let custom_domain = formData.get("custom_domain") as string | null

    // Limpieza final de slug en el backend por seguridad
    const cleanSlug = slug?.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-')

    // Validar autorización de plan para custom_domain
    if (custom_domain && !canUseCustomDomain(account.plan as Plan)) {
        return { error: "Tu plan actual no permite configurar un dominio personalizado." }
    }
    
    // Limpieza básica de dominio
    if (custom_domain !== null) {
        custom_domain = custom_domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '')
        if (custom_domain === "") {
            custom_domain = null
        }
    }

    if (custom_domain !== null) {
        const domainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/;
        if (!domainRegex.test(custom_domain) || custom_domain.length > 253) {
            return { error: "El formato del dominio no es válido." }
        }
    }

    // Preparar objeto de actualización
    const updateData: TablesUpdate<'accounts'> = { name, slug: cleanSlug, description, whatsapp }
    if (canUseCustomDomain(account.plan as Plan)) {
        updateData.custom_domain = custom_domain
    }

    const { error } = await supabase
        .from('accounts')
        .update(updateData)
        .eq('id', account.id)

    if (error) {
        // Interceptamos el código 23505 (Unique Violation en Postgres)
        if (error.code === '23505') {
             if (error.message.includes('custom_domain')) {
                 return { error: "Ese dominio ya está siendo utilizado por otro comercio. Por favor, verificá la propiedad." }
             }
            return { error: "Ese enlace de catálogo ya está siendo utilizado por otro comercio. Por favor, elegí uno distinto." }
        }
        return { error: "Ocurrió un error al guardar la configuración." }
    }

    revalidatePath('/admin/perfil')
    revalidatePath('/', 'layout')
    
    return { success: true, message: "Configuración actualizada correctamente" }
}
