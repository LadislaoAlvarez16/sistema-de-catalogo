import { MetadataRoute } from 'next'
import { createPublicClient } from "@/lib/supabase/server-public"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  const supabase = await createPublicClient()
  const { data: accounts } = await supabase
    .from('accounts')
    .select('slug')

  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    }
  ]

  if (accounts) {
    accounts.forEach((account) => {
      if (account.slug) {
        sitemapEntries.push({
          url: `${baseUrl}/${account.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        })
      }
    })
  }

  return sitemapEntries
}
