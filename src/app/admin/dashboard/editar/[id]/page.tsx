import { createClient } from '@/lib/supabase/server'
import { updateProductAction } from './actions'
import { notFound } from 'next/navigation'
import FormEditarProducto from './FormEditarProducto'
import Link from 'next/link'

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    const { data: account } = await supabase.from('accounts').select('id').eq('user_id', user?.id).single()

    const { data: product } = await supabase.from('products').select('*').eq('id', id).single()
    if (!product) notFound()

    const { data: categorias } = await supabase.from('categories').select('id, name').eq('account_id', account?.id)

    const updateActionWithId = updateProductAction.bind(null, id)

    return (
        <div className="min-h-screen bg-gray-50 p-6 text-gray-900">
            <div className="max-w-3xl mx-auto">
                <Link href="/admin/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
                    ← Volver
                </Link>
                <h1 className="text-2xl font-bold mb-6">Editar producto</h1>
                <FormEditarProducto product={product} categorias={categorias || []} action={updateActionWithId} />
            </div>
        </div>
    )
}