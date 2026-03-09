import { createClient } from '@/lib/supabase/server'
import FormWrapper from './FormWrapper'

export default async function NuevoProductoPage() {
    const supabase = await createClient()

    // 1. Obtener usuario
    const { data: { user } } = await supabase.auth.getUser()

    // 2. Obtener la cuenta para filtrar categorías
    const { data: account } = await supabase
        .from('accounts')
        .select('id')
        .eq('user_id', user?.id)
        .single()

    // 3. Traer las categorías dinámicas
    const { data: categorias } = await supabase
        .from('categories')
        .select('id, name')
        .eq('account_id', account?.id)

    return (
        <div className="max-w-md mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-6 text-center text-white">Agregar nuevo producto</h1>
            <FormWrapper categorias={categorias || []} />
        </div>
    )
}