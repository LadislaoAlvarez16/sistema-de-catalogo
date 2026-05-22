"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateAccountSettings(prevState: any, formData: FormData) {
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
    const description = formData.get("description") as string
    const whatsapp = formData.get("whatsapp") as string

    const { error } = await supabase
        .from('accounts')
        .update({ name, description, whatsapp })
        .eq('id', account.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/perfil')
    revalidatePath('/', 'layout')
    
    return { success: true, message: "Configuración actualizada correctamente" }
}
