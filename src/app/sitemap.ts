import { MetadataRoute } from 'next'
import { createPublicClient } from "@/lib/supabase/server-public"

type Account = {
  id: string;
  slug: string | null;
  plan: string;
}

type Product = {
  slug: string;
  account_id: string | null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    }
  ]

  try {
    const supabase = await createPublicClient()
    
    // Obtenemos todas las cuentas para generar las rutas base de cada tenant
    const { data: accountsData, error: accountsError } = await supabase
      .from('accounts')
      .select('id, slug, plan')

    if (accountsError) {
      console.error("Error obteniendo cuentas para el sitemap:", accountsError)
      return sitemapEntries
    }

    const accounts = accountsData as unknown as Account[];
    const proAccounts: Account[] = [];

    if (accounts) {
      accounts.forEach((account) => {
        // Rutas base para cada comercio (tenant)
        if (account.slug) {
          sitemapEntries.push({
            url: `${baseUrl}/${account.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
          })

          // Identificar comercios con plan Pro para el siguiente paso
          // Nota: La indexación de productos individuales es un feature exclusivo del plan Pro.
          if (account.plan && account.plan.toLowerCase() === 'pro') {
            proAccounts.push(account);
          }
        }
      })
    }

    // Indexación de productos individuales: Feature exclusivo del plan Pro
    if (proAccounts.length > 0) {
      const proAccountIds = proAccounts.map(acc => acc.id);
      
      // Consultamos los productos activos asociados a los comercios Pro
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('slug, account_id')
        .in('account_id', proAccountIds)
        .eq('active', true)

      if (productsError) {
        console.error("Error obteniendo productos Pro para el sitemap:", productsError)
      } else if (productsData) {
        const products = productsData as unknown as Product[];
        
        products.forEach(product => {
          if (product.slug && product.account_id) {
            // Buscamos el slug de la organización (tenant) para construir la URL absoluta
            const account = proAccounts.find(acc => acc.id === product.account_id);
            if (account && account.slug) {
              sitemapEntries.push({
                url: `${baseUrl}/${account.slug}/product/${product.slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7, // Prioridad un poco menor que la página principal del comercio
              })
            }
          }
        })
      }
    }
  } catch (err) {
    console.error("Error inesperado generando sitemap:", err);
    // En caso de error, retornamos las rutas procesadas hasta el momento
    // para no romper la compilación o el renderizado del sitemap.
  }

  return sitemapEntries
}
