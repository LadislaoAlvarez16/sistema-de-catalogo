# TiendaBase — Conventions

## Idioma

- Código, variables, funciones, nombres de componentes: **Inglés**
- Textos de UI y base de datos de contenido visible: **Español**
- Documentación y PRs: **Español**
- Mensajes de error expuestos al usuario: **Español** (mensajes de error internos/logs en inglés).

## Estructura de Next.js (App Router)

```text
src/
├── app/                  # Route handlers, pages y layouts
├── components/           # Componentes React reutilizables
│   ├── ui/               # Componentes base compartidos (botones, inputs)
│   ├── admin/            # Específicos del panel de control
│   └── catalog/          # Específicos de la vista pública de catálogos
├── lib/                  # Utilidades, inicializaciones (supabase, config)
└── types/                # Interfaces y tipos TypeScript
```

## Componentes y Hooks

- **Componentes React:** PascalCase (`ProductCard.tsx`, `Header.tsx`).
- **Hooks personalizados:** camelCase con prefijo `use` (`useCatalog.ts`).
- **Server Actions:** ubicados idealmente en archivos separados por dominio (ej. `actions/product.ts`), con `'use server'` al inicio del archivo.

## TypeScript y Reglas de Tipado

- **No usar `any`:** Favorecer `unknown` o tipos genéricos si el tipo estricto no es posible al instante.
- Definir tipos compartidos e interfaces referenciadas desde la base de datos (idealmente auto-generadas desde Supabase) en el directorio `types/`.

## Server Actions vs Client Components

- Por defecto, asume componentes como **Server Components** para SEO, performance y carga inicial.
- Solo marcar con `'use client'` si necesitas estado, efectos o eventos de mouse/teclado.
- Delegar las validaciones complejas de entrada a Server Actions, utilizando librerías como Zod (si aplica).

## Git y Control de Versiones

- Commits semánticos y descriptivos en Español: `feat: agregar buscador al catálogo`, `fix: corregir RLS en perfiles`.
- Separación de ramas: `main` como producción, usar ramas de feature para desarrollo.
