import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ProfileForm from './ProfileForm'

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

                {account ? (
                    <ProfileForm account={account} />
                ) : (
                    <p className="text-red-500">Error al cargar la cuenta</p>
                )}
            </div>
        </div>
    )
}