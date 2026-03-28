import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PLAN_RULES, type Plan } from '@/lib/plan/plan.config'

type Product = {
  id: string
  name: string
  category?: string
  price?: number
}

export default async function DashboardPage() {
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
  let categoryCount = 0 //Variable para guardar cuántas categorías tiene

  if (account && account.id) {
    // Buscar productos de la cuenta
    const { data: productsData } = await supabase
      .from('products')
      .select('*')
      .eq('account_id', account.id)
      .order('created_at', { ascending: false })

    products = productsData || []

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

  const productCount = products.length
  const isProductLimitReached = productCount >= limits.productLimit

  // Calculamos porcentajes para las barritas visuales
  const productPercentage = Math.min((productCount / limits.productLimit) * 100, 100)
  const categoryPercentage = Math.min((categoryCount / limits.categoryLimit) * 100, 100)

  // Si llega al 90%, pintamos la barra de naranja/rojo para alertar
  const productBarColor = productPercentage >= 100 ? 'bg-red-500' : productPercentage >= 90 ? 'bg-orange-500' : 'bg-blue-600'
  const categoryBarColor = categoryPercentage >= 100 ? 'bg-red-500' : categoryPercentage >= 90 ? 'bg-orange-500' : 'bg-purple-500'

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">¡Bienvenido, {user.email}!</h1>

        <div className="flex gap-3">
          <Link
            href="/admin/perfil"
            className="bg-white hover:bg-gray-50 text-gray-800 font-bold py-2 px-4 rounded transition border border-gray-300 shadow-sm"
          >
            Perfil
          </Link>
          <Link
            href="/admin/dashboard/categorias"
            className="bg-white hover:bg-gray-50 text-gray-800 font-bold py-2 px-4 rounded transition border border-gray-300 shadow-sm"
          >
            Categorías
          </Link>

          {/* . Bloqueao del botón si llegó al límite */}
          {isProductLimitReached ? (
            <button
              disabled
              className="bg-gray-400 cursor-not-allowed text-white font-bold py-2 px-4 rounded shadow-sm"
              title="Límite alcanzado. Pasate al plan Medio para subir más."
            >
              + Agregar producto
            </button>
          ) : (
            <Link
              href="/admin/dashboard/nuevo"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition shadow-sm"
            >
              + Agregar producto
            </Link>
          )}
        </div>
      </div>

      {/*. Grilla de Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* Tarjeta Plan */}
        <div className="bg-white p-5 rounded-lg shadow border border-gray-100 flex flex-col justify-center">
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Plan Actual</h3>
          <p className="text-3xl font-bold text-gray-800 capitalize mt-2">
            {currentPlan === 'basic' ? 'Básico 🟢' : currentPlan === 'medium' ? 'Medio 🔵' : 'Pro 🔴'}
          </p>
        </div>

        {/* Tarjeta Productos */}
        <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Productos</h3>
          <div className="mt-2 flex justify-between items-end">
            <span className="text-3xl font-bold text-gray-800">{productCount}</span>
            <span className="text-sm text-gray-500 mb-1">
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

        {/* Tarjeta Categorías */}
        <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Categorías</h3>
          <div className="mt-2 flex justify-between items-end">
            <span className="text-3xl font-bold text-gray-800">{categoryCount}</span>
            <span className="text-sm text-gray-500 mb-1">
              / {limits.categoryLimit >= 100 ? 'Ilimitado' : limits.categoryLimit}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 mt-4">
            <div className={`${categoryBarColor} h-2.5 rounded-full transition-all`} style={{ width: `${categoryPercentage}%` }}></div>
          </div>
        </div>

      </div>

      {/* Tabla de Productos */}
      {products.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {product.price ? `$${product.price}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link
                      href={`/admin/dashboard/editar/${product.id}`}
                      className="text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 bg-blue-50 px-4 py-2 rounded-md transition"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-8 text-center bg-gray-50 border border-dashed border-gray-300 rounded-lg p-12">
          <p className="text-gray-500 text-lg">Aún no tenés productos en tu catálogo.</p>
          {!isProductLimitReached && (
            <p className="text-gray-400 text-sm mt-2">Hacé clic en &quot;+ Agregar producto&quot; para empezar a vender.</p>
          )}
        </div>
      )}
    </div>
  )
}