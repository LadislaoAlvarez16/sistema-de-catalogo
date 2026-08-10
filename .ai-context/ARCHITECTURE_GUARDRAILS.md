# TiendaBase — Architecture Guardrails

Reglas que no se negocian. Antes de introducir cualquier cambio estructural, revisá esta lista. Si algo rompe una de estas reglas, necesita discusión explícita.

---

## Acceso a Datos y Seguridad

**NUNCA saltarse Row Level Security (RLS).**
La base de datos (Supabase) debe tener siempre habilitadas las políticas de RLS para las tablas de tenants (negocios), productos y categorías. No se debe usar una *Service Role Key* para bypassear RLS a menos que sea en procesos en background muy específicos y justificados (por ejemplo, sincronizaciones o generación de webhooks).

**Toda mutación de datos debe validar la sesión en el Server.**
No confíes únicamente en la UI para ocultar un botón. Todo Server Action que altere datos DEBE validar el usuario autenticado (via `supabase.auth.getUser()`) antes de ejecutar las operaciones de inserción/actualización/borrado.

---

## Arquitectura y Componentes

**Uso de Server Actions sobre Route Handlers (API Routes).**
Mantener la mutación de datos centralizada en Server Actions (funciones asíncronas con `'use server'`) para un ecosistema Next.js cohesivo. Sólo recurrir a Route Handlers (`route.ts`) para integraciones externas, webhooks entrantes o endpoints públicos consumidos por otros servicios.

**Server Components por defecto.**
Todo componente en la jerarquía debe ser un React Server Component (RSC) a menos que necesite hooks de React (`useState`, `useEffect`) o interactividad del DOM. En ese caso, usa la directiva `'use client'` de forma aislada (hojas del árbol de componentes).

---

## UX y UI

**Mobile-First SIEMPRE.**
El caso de uso principal de esta aplicación es desde el celular: tanto para el dueño administrando la tienda vía la PWA, como para el comprador final navegando el catálogo desde un link de WhatsApp. Todo diseño debe validarse primero en vistas móviles.

**Aislamiento de la aplicación pública vs admin.**
El código del admin (`/admin`) nunca debe afectar el catálogo público (`/[account]`). Los bundles de dependencias y estilos deben mantenerse limpios para asegurar que el catálogo de cara al cliente cargue de forma instantánea.

---

## Lo que no se agrega sin discusión previa

- Integración con pasarelas de pago (El modelo actual prioriza WhatsApp y contacto directo).
- Múltiples usuarios administradores por negocio (MVP prioriza 1 negocio = 1 dueño).
- Migración fuera de Vercel/Supabase (El stack Serverless es core de la arquitectura elegida).
