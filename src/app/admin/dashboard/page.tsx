import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

type Product = {
  id: string
  name: string
  category?: string
  price?: number
  // agrega otros campos si los necesitas
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
  if (account && account.id) {
    // Buscar productos de la cuenta
    const { data: productsData } = await supabase
      .from('products')
      .select('*')
      .eq('account_id', account.id)
      .order('created_at', { ascending: false })
    products = productsData || []
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">¡Bienvenido, {user.email}!</h1>

      {products.length > 0 ? (
        <div className="overflow-x-auto rounded shadow bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.category || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.price ? `$${product.price}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition"
                      type="button"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-8 text-center text-gray-500 text-lg">
          Aún no tenés productos. ¡Agregá el primero!
        </div>
      )}
    </div>
  )
}
