import { SupabaseClient } from '@supabase/supabase-js'

export function slugify(text: string): string {
    return text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
}

export async function generateUniqueSlug(
    name: string,
    accountId: string,
    supabase: SupabaseClient<any, "public", any>,
    currentProductId?: string
): Promise<string> {
    const baseSlug = slugify(name)
    let slug = baseSlug
    let counter = 1
    let isUnique = false

    while (!isUnique) {
        let query = supabase
            .from('products')
            .select('id')
            .eq('account_id', accountId)
            .eq('slug', slug)
        
        if (currentProductId) {
            query = query.neq('id', currentProductId)
        }

        const { data } = await query.maybeSingle()

        if (!data) {
            isUnique = true
        } else {
            slug = `${baseSlug}-${counter}`
            counter++
        }
    }

    return slug
}
