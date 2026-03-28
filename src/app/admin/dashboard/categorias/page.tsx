import { createClient } from '@/lib/supabase/server'
import { addCategoryAction, deleteCategoryAction } from './actions'
import { PLAN_RULES, type Plan } from '@/lib/plan/plan.config'

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
        <div className="max-w-3xl mx-auto py-10 px-4 text-zinc-100">
            <h1 className="text-2xl font-bold mb-6">Gestionar Categorías</h1>

            {/* Formulario para agregar */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl mb-8">
                <h2 className="text-lg font-semibold mb-4">Nueva Categoría</h2>

                {/* Le ponemos un aviso visual si llegó al límite */}
                <form action={addCategoryAction} className="flex gap-4">
                    <input
                        type="text"
                        name="name"
                        placeholder={isLimitReached ? "Límite alcanzado" : "Ej: Cajas Fuertes"}
                        required
                        disabled={isLimitReached} // Bloquea escribir
                        className={`flex-1 border rounded px-4 py-2 focus:outline-none transition ${isLimitReached
                            ? 'bg-zinc-800 border-zinc-700 text-zinc-500 cursor-not-allowed'
                            : 'bg-zinc-950 border-zinc-700 text-white focus:border-blue-500'
                            }`}
                    />
                    <button
                        type="submit"
                        disabled={isLimitReached} // Bloquea el clic
                        className={`font-bold py-2 px-6 rounded-lg transition ${isLimitReached
                            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                    >
                        Agregar
                    </button>
                </form>

                {isLimitReached && (
                    <p className="text-red-400 text-sm mt-3 font-medium">
                        Alcanzaste el límite de {limit} categorías para el plan {currentPlan === 'basic' ? 'Básico' : currentPlan}. Contactanos para ampliar.
                    </p>
                )}
            </div>

            {/* Lista de categorías */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-zinc-950 border-b border-zinc-800">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold text-zinc-400">Nombre</th>
                            <th className="px-6 py-4 text-sm font-semibold text-zinc-400 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {categorias?.map((cat) => (
                            <tr key={cat.id} className="hover:bg-zinc-800/50 transition">
                                <td className="px-6 py-4">{cat.name}</td>
                                <td className="px-6 py-4 text-right">
                                    <form action={deleteCategoryAction}>
                                        <input type="hidden" name="id" value={cat.id} />
                                        <button type="submit" className="text-red-400 hover:text-red-300 font-medium transition">
                                            Eliminar
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        {categorias?.length === 0 && (
                            <tr>
                                <td colSpan={2} className="px-6 py-8 text-center text-zinc-500">
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