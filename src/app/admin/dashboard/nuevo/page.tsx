import { createClient } from '@/lib/supabase/server'
import FormWrapper from './FormWrapper'
import Link from 'next/link'

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
        <div className="min-h-screen bg-gray-50 p-6 text-gray-900">
            <div className="max-w-3xl mx-auto">
                <Link href="/admin/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
                    ← Volver
                </Link>
                <h1 className="text-2xl font-bold mb-6">Agregar nuevo producto</h1>
                <FormWrapper categorias={categorias || []} />
            </div>
        </div>
    )
}