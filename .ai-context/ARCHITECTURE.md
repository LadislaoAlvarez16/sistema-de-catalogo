# TiendaBase (Sistema-catalogo) — Architecture

## Tipo de arquitectura
Aplicación Serverless / Edge usando Next.js App Router. Enfoque "Backend-as-a-Service" (BaaS) integrando el Frontend, Backend (Server Actions) y Base de Datos (Supabase) en un mismo repositorio.

## Stack técnico
- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript 5
- **Estilos:** Tailwind CSS
- **Base de Datos:** PostgreSQL (vía Supabase)
- **Autenticación & Backend:** Supabase Auth + React Server Actions
- **Despliegue:** Vercel

## Seguridad y Control de Acceso
- **Aislamiento Multitenant (Row Level Security - RLS):** Toda interacción directa con base de datos cuenta con políticas de RLS. Un negocio (tenant) solo puede leer, actualizar o borrar datos asociados a su usuario, garantizando aislamiento estricto de los datos.
- **Validación del lado del servidor:** Toda operación de mutación de datos (Server Actions) y obtención crítica debe verificar la sesión actual mediante `supabase.auth.getUser()`.
- **Rutas Protegidas:** Todo lo que cuelga bajo `/admin` requiere autenticación y maneja redirecciones automáticas (ej. Middleware o chequeos Server-side).

## Modelo de Datos y Acceso
El sistema se divide principalmente en dos zonas funcionales:

### 1. Panel de Administración (`/admin`)
- Funciona como una PWA (Progressive Web App) instalable por los administradores de los negocios.
- Utiliza Server Actions para mutaciones (ej. crear producto, editar perfil, manejar categorías) permitiendo una experiencia robusta y reduciendo la necesidad de endpoints de API clásicos.
- Lecturas de datos directas desde Server Components cuando sea posible para mejorar velocidad e indexación.

### 2. Catálogo Público (`/[account]`)
- Rutas públicas servidas idealmente mediante SSR/SSG.
- Enfocadas en el SEO dinámico, generación de `sitemap.xml` y microdatos schema.org (especialmente en Plan Pro).
- Aislamiento visual y de URL: Cada tenant es accesible vía sub-ruta (slug).
