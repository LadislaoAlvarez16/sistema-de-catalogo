import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // 1. Refrescar tokens (Separation of Concerns: updateSession solo gestiona cookies)
  const { supabaseResponse, user } = await updateSession(request)

  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') || ''
  const mainDomain = process.env.NODE_ENV === 'production' ? 'sistema-de-catalogo.vercel.app' : 'localhost:3000'

  // 2. Proteger rutas de admin (Lógica de enrutamiento y seguridad)
  if (
    pathname.startsWith('/admin') &&
    pathname !== '/admin/login' &&
    pathname !== '/admin/register'
  ) {
    if (!user) {
      // Redirigir al login
      const loginUrl = new URL('/admin/login', request.url)
      const redirectResponse = NextResponse.redirect(loginUrl)
      
      // Preservar las cookies frescas seteadas por updateSession
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value)
      })
      
      return redirectResponse
    }
  }

  // 3. Lógica de enrutamiento para dominios personalizados (Migrada del proxy)
  if (!hostname.includes(mainDomain)) {
    // Reescribimos la ruta internamente
    request.nextUrl.pathname = `/${hostname}${pathname}`
    const rewriteResponse = NextResponse.rewrite(request.nextUrl)
    
    // Copiar las cookies actualizadas de Supabase a la nueva respuesta
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      rewriteResponse.cookies.set(cookie.name, cookie.value)
    })
    
    return rewriteResponse
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt, sitemap.xml (metadata files)
     * - api (public API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api).*)',
  ],
}
