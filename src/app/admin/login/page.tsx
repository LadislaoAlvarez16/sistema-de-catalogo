'use client'

import { useActionState } from 'react'
import { loginAction } from './actions'

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, { error: "" })

  return (
    <div className="flex flex-col justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Panel de Administración
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Ingresá a tu cuenta para gestionar tu catálogo
        </p>
      </div>

      <form
        action={formAction}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100"
      >
        {state?.error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {state.error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              autoComplete="email"
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm placeholder-gray-400 focus:border-black focus:outline-none focus:ring-black sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm placeholder-gray-400 focus:border-black focus:outline-none focus:ring-black sm:text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
          >
            Iniciar sesión
          </button>
        </div>
      </form>
    </div>
  )
}