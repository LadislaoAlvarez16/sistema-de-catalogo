import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { ArrowLeft } from 'lucide-react'

export default async function PerfilPage() {
    // 1. Verificamos la sesión exactamente igual que en tu Dashboard
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    // 2. Buscamos los datos de la cuenta
    const { data: account } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .single()

    // 3. Esta función se ejecuta en el servidor cuando tocás "Guardar"
    async function updateProfile(formData: FormData) {
        "use server"
        const supabase = await createClient()

        // Extraemos los datos del formulario
        const name = formData.get("name") as string
        const description = formData.get("description") as string
        const whatsapp = formData.get("whatsapp") as string

        // Actualizamos en la base de datos
        await supabase
            .from('accounts')
            .update({ name, description, whatsapp })
            .eq('id', account.id)

        // Limpiamos el caché y volvemos al dashboard para mostrar que se guardó
        revalidatePath('/admin/perfil')
        revalidatePath('/', 'layout')
        redirect('/admin/dashboard')
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 text-gray-900">
            <div className="max-w-2xl mx-auto">
                <Link
                    href="/admin/dashboard"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Volver</span>
                </Link>

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Perfil del Negocio</h1>
                    <p className="text-sm text-gray-600">
                        Actualizá la información que ven tus clientes en el catálogo público.
                    </p>
                </div>

                <form action={updateProfile} className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Nombre del Local
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            defaultValue={account?.name || ""}
                            placeholder="Ej: Cerrajería Pepe"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Descripción breve
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            defaultValue={account?.description || ""}
                            placeholder="Ej: Cerrajería 24hs. Copias en el acto."
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all resize-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Número de WhatsApp
                        </label>
                        <input
                            id="whatsapp"
                            name="whatsapp"
                            type="text"
                            defaultValue={account?.whatsapp || ""}
                            placeholder="Ej: 5491112345678"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                        />
                        <p className="text-xs text-gray-500 mt-1.5">
                            Ingresá el código de país y área sin el símbolo + ni espacios.
                        </p>
                    </div>

                    <div className="pt-4 flex justify-end border-t border-gray-100">
                        <button
                            type="submit"
                            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                        >
                            Guardar cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}