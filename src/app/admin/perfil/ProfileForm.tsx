"use client"

import { useActionState, useState } from "react"
import { updateAccountSettings } from "./actions"
import DownloadQRButton from './DownloadQRButton'

type Props = {
    account: {
        name: string
        description: string | null
        whatsapp: string | null
        slug: string | null
    }
}

export default function ProfileForm({ account }: Props) {
    const [state, formAction, isPending] = useActionState(updateAccountSettings, null)
    const [slug, setSlug] = useState(account?.slug || "")

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        // Convierte a minúsculas, quita caracteres especiales dejando guiones y letras/números
        const formatted = val.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-')
        setSlug(formatted)
    }

    return (
        <form action={formAction} className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
            {state?.success && (
                <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 font-medium">
                    {state.message}
                </div>
            )}
            {state?.error && !state.error.includes("enlace de catálogo") && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 font-medium">
                    {state.error}
                </div>
            )}
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
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Enlace de tu catálogo
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <input
                        id="slug"
                        name="slug"
                        type="text"
                        value={slug}
                        onChange={handleSlugChange}
                        placeholder="ej-cerrajeria-pepe"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                        required
                    />
                    {slug && (
                        <div className="shrink-0">
                            <DownloadQRButton slug={slug} />
                        </div>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    Tu enlace público será: <span className="font-medium text-gray-700">tiendabase.com/{slug || 'tu-slug'}</span>
                </p>
                <p className="text-xs text-amber-600 mt-1 font-medium">
                    Nota: Si cambias este enlace, los links anteriores que hayas compartido dejarán de funcionar.
                </p>
                {state?.error && state.error.includes("enlace de catálogo") && (
                    <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm font-medium">
                        {state.error}
                    </div>
                )}
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
                    disabled={isPending}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? "Guardando..." : "Guardar cambios"}
                </button>
            </div>
        </form>
    )
}
