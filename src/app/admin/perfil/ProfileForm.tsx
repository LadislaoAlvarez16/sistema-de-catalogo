"use client"

import { useActionState } from "react"
import { updateAccountSettings } from "./actions"

type Props = {
    account: {
        name: string
        description: string | null
        whatsapp: string | null
    }
}

export default function ProfileForm({ account }: Props) {
    const [state, formAction, isPending] = useActionState(updateAccountSettings, null)

    return (
        <form action={formAction} className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
            {state?.success && (
                <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 font-medium">
                    {state.message}
                </div>
            )}
            {state?.error && (
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
