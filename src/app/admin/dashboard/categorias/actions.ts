"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { PLAN_RULES, type Plan } from '@/lib/plan/plan.config'

export async function addCategoryAction(formData: FormData) {
    const name = formData.get('name') as string
    if (!name) return

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Buscamos la cuenta Y su plan actual
    const { data: account } = await supabase
        .from('accounts')
        .select('id, plan')
        .eq('user_id', user?.id)
        .single()

    if (!account) throw new Error("Cuenta no encontrada")

    // Lógica de seguridad en el backend (El Patovica)
    const currentPlan = (account.plan as Plan) || 'basic'
    const limit = PLAN_RULES[currentPlan].categoryLimit

    // Le pedimos a Supabase que cuente cuántas categorías hay
    const { count } = await supabase
        .from('categories')
        .select('id', { count: 'exact', head: true })
        .eq('account_id', account.id)

    // Si ya llegó o superó el límite, cortamos la ejecución y tiramos error
    if (count !== null && count >= limit) {
        throw new Error(`Acceso denegado: El plan ${currentPlan} permite un máximo de ${limit} categorías.`)
    }

    // Si pasó el control, generamos el slug limpio
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