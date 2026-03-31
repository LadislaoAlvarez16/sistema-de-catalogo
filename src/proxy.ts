import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  // 1. Primero, dejamos que Supabase valide la sesión (Autenticación del Admin)
  const response = await updateSession(request)

  // 2. El Enrutador de Locales
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''

  // Acá definís tu dominio principal (el tuyo, donde está el panel admin)
  const mainDomain = process.env.NODE_ENV === 'production' ? 'tudominio.com.ar' : 'localhost:3000'

  // Si alguien entra desde un dominio que NO es el tuyo (Ej: cerrajeria-pepe.com.ar)
  if (!hostname.includes(mainDomain)) {
    // Reescribimos la ruta internamente
    url.pathname = `/${hostname}${url.pathname}`
    return NextResponse.rewrite(url)
  }

  // Si entró por tu dominio principal, lo dejamos pasar normal
  return response
}

export const config = {
  matcher: [
    /*
     Excluye archivos estáticos, imágenes, y rutas internas de Next.js.
     Protege todo lo que no sea: _next, static, favicon, robots, etc.
    */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api|public).*)',
  ],
}