import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

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
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">Perfil del Negocio</h1>
                    <p className="text-gray-600 text-sm">
                        Actualizá la información que ven tus clientes en el catálogo público.
                    </p>
                </div>
                <Link
                    href="/admin/dashboard"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    &larr; Volver al Dashboard
                </Link>
            </div>

            {/* Fíjate que acá usamos action={updateProfile} */}
            <form action={updateProfile} className="space-y-6 bg-white p-6 rounded shadow border border-gray-200 max-w-2xl">

                {/* Nombre del Local */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-bold text-gray-700">
                        Nombre del Local
                    </label>
                    <input
                        id="name"
                        name="name" // Obligatorio para FormData
                        type="text"
                        defaultValue={account?.name || ""} // defaultValue en vez de value
                        placeholder="Ej: Cerrajería Pepe"
                        className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Descripción */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="description" className="text-sm font-bold text-gray-700">
                        Descripción breve
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        defaultValue={account?.description || ""}
                        placeholder="Ej: Cerrajería 24hs. Copias en el acto."
                        rows={3}
                        className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                    />
                </div>

                {/* WhatsApp */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="whatsapp" className="text-sm font-bold text-gray-700">
                        Número de WhatsApp
                    </label>
                    <input
                        id="whatsapp"
                        name="whatsapp"
                        type="text"
                        defaultValue={account?.whatsapp || ""}
                        placeholder="Ej: 5491112345678"
                        className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500">
                        Ingresá el código de país y área sin el símbolo + ni espacios.
                    </p>
                </div>

                {/* Botón Guardar */}
                <div className="pt-4 flex items-center justify-end border-t border-gray-100">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition"
                    >
                        Guardar cambios
                    </button>
                </div>

            </form>
        </div>
    )
}