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
    supabase: SupabaseClient<any, "public", any>,
    name: string,
    accountId: string,
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
            .select('slug')
            .eq('slug', slug)
        
        if (currentProductId && typeof currentProductId === 'string' && currentProductId.trim() !== '') {
            query = query.neq('id', currentProductId.trim())
        }

        const { data, error } = await query

        if (error) {
            throw new Error(`Error verificando unicidad del slug: ${error.message}`)
        }

        if (data && data.length === 0) {
            isUnique = true
        } else {
            slug = `${baseSlug}-${counter}`
            counter++
        }
    }

    return slug
}
