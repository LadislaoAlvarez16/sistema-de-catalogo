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
        if (counter > 20) {
            slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`
            break
        }

        let query = supabase
            .from('products')
            .select('id', { count: 'exact', head: true })
            .eq('account_id', accountId)
            .eq('slug', slug)
        
        if (currentProductId && typeof currentProductId === 'string' && currentProductId.trim() !== '') {
            query = query.neq('id', currentProductId.trim())
        }

        const { count, error } = await query

        if (error || count === null || count === 0) {
            isUnique = true
        } else {
            slug = `${baseSlug}-${counter}`
            counter++
        }
    }

    return slug
}
