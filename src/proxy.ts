import { updateSession } from '@/lib/supabase/middleware'
import { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  return updateSession(request)
}

export { updateSession as middleware }

export const config = {
  matcher: [
    /*
      Excluye archivos estáticos, imágenes, y rutas internas de Next.js.
      Protege todo lo que no sea: _next, static, favicon, robots, etc.
    */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api|public).*)',
  ],
}