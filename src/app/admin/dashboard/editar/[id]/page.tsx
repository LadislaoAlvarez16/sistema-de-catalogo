import { createClient } from '@/lib/supabase/server'
import { updateProductAction } from './actions'
import { notFound } from 'next/navigation'
import FormEditarProducto from './FormEditarProducto'

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
        <div className="max-w-md mx-auto py-10 px-4 text-white">
            <h1 className="text-2xl font-bold mb-6 text-center">Editar producto</h1>
            <FormEditarProducto product={product} categorias={categorias || []} action={updateActionWithId} />
        </div>
    )
}