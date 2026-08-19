import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import DeleteProductButton from '@/components/admin/DeleteProductButton'
import { PLAN_RULES, type Plan } from '@/lib/plan/plan.config'
import CopyCatalogLink from '@/components/admin/CopyCatalogLink'
import { ExternalLink, Plus } from 'lucide-react'
import ToggleProductVisibility from '@/components/admin/ToggleProductVisibility'
import DashboardMobileMenu from '@/components/admin/DashboardMobileMenu'
import OnboardingFlow from '@/components/admin/OnboardingFlow'
import SearchBar from '@/components/admin/SearchBar'
import Pagination from '@/components/admin/Pagination'

type Product = {
  id: string
  name: string
  category?: string
  price?: number
  image_url?: string | null
  active?: boolean
}

export default async function DashboardPage(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = props.searchParams ? await props.searchParams : {}
  const query = typeof searchParams.query === 'string' ? searchParams.query : ''
  const currentPage = typeof searchParams.page === 'string' ? Math.max(1, parseInt(searchParams.page) || 1) : 1
  const ITEMS_PER_PAGE = 10
  const from = (currentPage - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Buscar la cuenta asociada al usuario
  const { data: account } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', user.id)
    .single()

  let products: Product[] = []
  let totalProductCount = 0 // Variable para guardar el total real de productos
  let categoryCount = 0 //Variable para guardar cuántas categorías tiene
  let fetchError: string | null = null
  let totalPages = 1 // Fallback value for Pagination component

  if (account && account.id) {
    // Buscar productos de la cuenta
    // Optimizamos el payload seleccionando solo campos requeridos para la tabla (incluyendo imagen) y solicitamos el count
    let queryBuilder = supabase
      .from('products')
      .select('id, name, category, price, active, image_url', { count: 'exact' })
      .eq('account_id', account.id)

    // Si hay búsqueda, filtramos usando ilike
    if (query) {
      queryBuilder = queryBuilder.ilike('name', `%${query}%`)
    }

    const { data: productsData, error, count: filteredCount } = await queryBuilder
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      console.error('Error fetching products:', error)
      fetchError = 'Ocurrió un error al cargar los productos.'
    } else {
      products = productsData || []
    }

    // Calculamos el total de páginas en base al total filtrado
    const totalFilteredCount = filteredCount || 0
    totalPages = Math.max(1, Math.ceil(totalFilteredCount / ITEMS_PER_PAGE))

    // Le pedimos a Supabase que solo cuente los productos (súper rápido)
    const { count: pCount } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('account_id', account.id)

    totalProductCount = pCount || 0

    // Le pedimos a Supabase que solo cuente las categorías (súper rápido)
    const { count } = await supabase
      .from('categories')
      .select('id', { count: 'exact', head: true })
      .eq('account_id', account.id)

    categoryCount = count || 0
  }

  // Lógica pura de límites:
  const currentPlan = (account?.plan as Plan) || 'basic' // Si no tiene, asume basic
  const limits = PLAN_RULES[currentPlan]

  const isProductLimitReached = totalProductCount >= limits.productLimit

  // Calculamos porcentajes para las barritas visuales
  const productPercentage = Math.min((totalProductCount / limits.productLimit) * 100, 100)
  const categoryPercentage = Math.min((categoryCount / limits.categoryLimit) * 100, 100)

  // Si llega al 90%, pintamos la barra de naranja/rojo para alertar
  const productBarColor = productPercentage >= 100 ? 'bg-red-500' : productPercentage >= 90 ? 'bg-orange-500' : 'bg-blue-600'
  const categoryBarColor = categoryPercentage >= 100 ? 'bg-red-500' : categoryPercentage >= 90 ? 'bg-orange-500' : 'bg-purple-500'

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mb-8 gap-4">
          <div className="flex justify-between items-center w-full">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate pr-4">¡Bienvenido, {account?.name || user.email}!</h1>
            <DashboardMobileMenu />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {account?.slug && (
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${account.slug}`}
                    target="_blank"
                    className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="hidden sm:inline">Ver catálogo público</span>
                  </Link>
                  <CopyCatalogLink slug={account.slug} />
                </div>
              )}
            </div>

            {isProductLimitReached ? (
              <button
                disabled
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-gray-300 text-gray-500 cursor-not-allowed py-3 px-4 rounded-lg font-medium text-sm shadow-sm mt-4 md:mt-0"
                title="Límite alcanzado. Pasate al plan Medio para subir más."
              >
                <Plus className="h-5 w-5" /> Agregar producto
              </button>
            ) : (
              <Link
                href="/admin/dashboard/nuevo"
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-lg font-medium text-sm transition-colors shadow-sm mt-4 md:mt-0"
              >
                <Plus className="h-5 w-5" /> Agregar producto
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Plan Actual</h3>
            <p className="text-3xl font-extrabold text-gray-900 capitalize">
              {currentPlan === 'basic' ? 'Básico 🟢' : 'Pro 🔴'}
            </p>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Productos</h3>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-extrabold text-gray-900">{totalProductCount}</span>
              <span className="text-sm text-gray-500">
                / {limits.productLimit >= 2000 ? 'Ilimitado' : limits.productLimit}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 mt-4">
              <div className={`${productBarColor} h-2.5 rounded-full transition-all`} style={{ width: `${productPercentage}%` }}></div>
            </div>
            {isProductLimitReached && (
              <p className="text-xs text-red-500 mt-2 font-medium">Límite alcanzado. ¡Contactanos para ampliar!</p>
            )}
          </div>

          <Link
            href="/admin/dashboard/categorias"
            aria-label="Gestionar categorías"
            className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between cursor-pointer block transition duration-150 ease-in-out hover:border-neutral-400 hover:shadow-sm active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
          >
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Categorías</h3>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-extrabold text-gray-900">{categoryCount}</span>
              <span className="text-sm text-gray-500">
                / {limits.categoryLimit >= 100 ? 'Ilimitado' : limits.categoryLimit}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 mt-4">
              <div className={`${categoryBarColor} h-2.5 rounded-full transition-all`} style={{ width: `${categoryPercentage}%` }}></div>
            </div>
          </Link>
        </div>

        {fetchError ? (
          <div className="mt-8 text-center bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <p className="text-red-600 font-medium">{fetchError}</p>
          </div>
        ) : totalProductCount > 0 ? (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Tus Productos</h2>
              <SearchBar />
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 border-b border-gray-200 hidden md:table-header-group">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Imagen</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y md:divide-y-0 divide-gray-100 md:divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className={`block md:table-row p-4 md:p-0 hover:bg-gray-50 transition-colors border-b border-gray-200 md:border-gray-100 last:border-0 ${product.active === false ? 'opacity-60 grayscale' : ''}`}>
                    <td className="flex justify-between items-center md:table-cell px-2 py-3 md:px-6 md:py-4 whitespace-nowrap border-b border-gray-100 md:border-none">
                      <span className="md:hidden font-semibold text-gray-500 text-sm">Imagen</span>
                      {product.image_url ? (
                        <Image 
                          src={product.image_url} 
                          alt={product.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 object-cover rounded-md border border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center border border-gray-200">
                          <span className="text-gray-400 text-xs text-center leading-tight">Sin<br/>img</span>
                        </div>
                      )}
                    </td>
                    <td className="flex justify-between items-center md:table-cell px-2 py-3 md:px-6 md:py-4 border-b border-gray-100 md:border-none">
                      <span className="md:hidden font-semibold text-gray-500 text-sm">Nombre</span>
                      <span className="text-sm text-gray-700 font-medium truncate max-w-[200px] sm:max-w-xs md:max-w-none text-right md:text-left">{product.name}</span>
                    </td>
                    <td className="flex justify-between items-center md:table-cell px-2 py-3 md:px-6 md:py-4 whitespace-nowrap border-b border-gray-100 md:border-none">
                      <span className="md:hidden font-semibold text-gray-500 text-sm">Categoría</span>
                      <span className="text-sm text-gray-700 text-right md:text-left">{product.category || '-'}</span>
                    </td>
                    <td className="flex justify-between items-center md:table-cell px-2 py-3 md:px-6 md:py-4 whitespace-nowrap border-b border-gray-100 md:border-none">
                      <span className="md:hidden font-semibold text-gray-500 text-sm">Precio</span>
                      <span className="text-sm text-gray-700 text-right md:text-left">{product.price ? `$${product.price}` : '-'}</span>
                    </td>
                    <td className="block md:table-cell px-2 py-4 md:px-6 md:py-4 text-right text-sm">
                      <div className="flex flex-wrap gap-3 mt-4 md:mt-0 md:justify-end w-full">
                        <ToggleProductVisibility 
                          productId={product.id} 
                          initialIsActive={product.active ?? true} 
                        />
                        <Link
                          href={`/admin/dashboard/editar/${product.id}`}
                          className="flex-1 md:flex-none text-center text-blue-600 hover:text-blue-900 font-medium bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-lg transition-colors"
                        >
                          Editar
                        </Link>
                        <DeleteProductButton productId={product.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination totalPages={totalPages} currentPage={currentPage} />
        </>
        ) : (
          <OnboardingFlow slug={account?.slug} productosCount={totalProductCount} />
        )}
      </div>
    </div>
  )
}