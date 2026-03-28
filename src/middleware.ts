import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  //  Primero, dejamos que Supabase valide la sesión (Autenticación del Admin)
  const response = await updateSession(request)

  // El Enrutador de Locales 
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''

  // Acá definís tu dominio principal (el tuyo, donde está el panel admin)
  // En local es localhost:3000. En producción será algo como "tucatalogo.com.ar"
  const mainDomain = process.env.NODE_ENV === 'production' ? 'tudominio.com.ar' : 'localhost:3000'

  // Si alguien entra desde un dominio que NO es el tuyo (Ej: cerrajeria-pepe.com.ar)
  if (!hostname.includes(mainDomain)) {
    // Reescribimos la ruta internamente (por abajo de la mesa)
    // Le decimos a Next.js: "Agarrá a este usuario y mandalo a la carpeta [account]"

    // NOTA: Para este ejemplo básico, usamos el hostname completo. 
    // Luego en tu página buscarás en BD qué 'slug' le corresponde a este 'host'.
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