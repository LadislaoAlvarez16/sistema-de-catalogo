import { createClient } from '@/lib/supabase/server'
import { addCategoryAction, deleteCategoryAction } from './actions'
import { PLAN_RULES, type Plan } from '@/lib/plan/plan.config'
import Link from 'next/link'

export default async function CategoriasPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: account } = await supabase
        .from('accounts')
        //  Agregamos 'plan' al select para saber qué plan tiene
        .select('id, plan')
        .eq('user_id', user?.id)
        .single()

    // Traemos las categorías de esta cuenta
    const { data: categorias } = await supabase
        .from('categories')
        .select('*')
        .eq('account_id', account?.id)
        .order('created_at', { ascending: false })

    // Lógica de límites
    const currentPlan = (account?.plan as Plan) || 'basic'
    const limit = PLAN_RULES[currentPlan].categoryLimit
    const categoryCount = categorias?.length || 0
    const isLimitReached = categoryCount >= limit

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 text-gray-900 max-w-4xl mx-auto">
            <Link href="/admin/dashboard" className="inline-flex items-center bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors mb-6">
                ← Volver
            </Link>
            <h1 className="text-2xl font-bold mb-6">Gestionar Categorías</h1>

            {/* Formulario para agregar */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                <h2 className="text-lg font-semibold mb-4">Nueva Categoría</h2>

                {/* Le ponemos un aviso visual si llegó al límite */}
                <form action={addCategoryAction} className="flex flex-col sm:flex-row gap-4 items-end">
                    <input
                        type="text"
                        name="name"
                        placeholder={isLimitReached ? "Límite alcanzado" : "Ej: Cajas Fuertes"}
                        required
                        disabled={isLimitReached} // Bloquea escribir
                        className={`flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isLimitReached
                            ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-white text-gray-900'
                            }`}
                    />
                    <button
                        type="submit"
                        disabled={isLimitReached} // Bloquea el clic
                        className={`bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors ${isLimitReached
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : ''
                            }`}
                    >
                        Agregar
                    </button>
                </form>

                {isLimitReached && (
                    <p className="text-red-600 text-sm mt-3 font-medium">
                        Alcanzaste el límite de {limit} categorías para el plan {currentPlan === 'basic' ? 'Básico' : currentPlan}. Contactanos para ampliar.
                    </p>
                )}
            </div>

            {/* Lista de categorías */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Nombre</th>
                            <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categorias?.map((cat) => (
                            <tr key={cat.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4">{cat.name}</td>
                                <td className="px-6 py-4 text-right">
                                    <form action={deleteCategoryAction}>
                                        <input type="hidden" name="id" value={cat.id} />
                                        <button type="submit" className="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                                            Eliminar
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        {categorias?.length === 0 && (
                            <tr>
                                <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                                    No tenés categorías creadas. ¡Agregá la primera arriba!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}