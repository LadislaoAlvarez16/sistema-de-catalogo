'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteProductServerAction(productId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

    if (error) {
        throw new Error(`Error al eliminar el producto: ${error.message}`)
    }

    revalidatePath('/admin/dashboard')
}