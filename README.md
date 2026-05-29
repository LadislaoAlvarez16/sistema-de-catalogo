# 🗂️ TiendaBase — SaaS de Catálogos Digitales para Negocios

[![CI Tests](https://github.com/LadislaoAlvarez16/sistema-de-catalogo/actions/workflows/test.yml/badge.svg)](https://github.com/LadislaoAlvarez16/sistema-de-catalogo/actions/workflows/test.yml)

Plataforma SaaS multitenant para que comercios y emprendedores reemplacen sus PDFs y listas de WhatsApp por un catálogo web profesional, rápido, instalable en celulares y 100% autogestionable — sin depender de un desarrollador para cada cambio.

🔗 **En producción:** [sistema-de-catalogo.vercel.app/almacen-deco](https://sistema-de-catalogo.vercel.app/almacen-deco)  
🌐 **Landing:** [sistema-de-catalogo.vercel.app](https://sistema-de-catalogo.vercel.app)

---

## ¿Qué problema resuelve?

Los negocios pequeños comparten sus productos por PDF o imágenes de WhatsApp: difícil de actualizar, sin buscador, sin precios claros, mala experiencia para el cliente. TiendaBase les da:

- Un catálogo web profesional con URL propia
- Panel de administración autogestionable desde el celular (PWA)
- Botón de WhatsApp directo por producto con mensaje prearmado
- Posicionamiento en Google con SEO automático (plan Pro)
- Sin comisiones por venta, sin depender de plataformas de terceros

---

## ✨ Funcionalidades

### Catálogo público (`/{negocio}`)

- Buscador en tiempo real y filtro por categorías — disponible en todos los planes
- Modal flotante con detalle del producto — disponible en todos los planes
- Botón de WhatsApp directo en cada tarjeta de producto con mensaje prearmado
- Filtros avanzados por rango de precio (plan Pro)
- Páginas individuales por producto con URL semántica (plan Pro)
- SEO automático: `schema.org/LocalBusiness`, `schema.org/Product`, `og:image` dinámico
- `sitemap.xml` y `robots.txt` generados automáticamente
- Diseño responsive mobile-first
- Empty states amigables y manejo de errores 404 limpio

### Panel de administración (`/admin`)

- **PWA instalable:** el dueño instala el panel en la pantalla de inicio de su celular
- Registro de nuevos negocios con generación automática y validación de slug en tiempo real
- Carga, edición y eliminación de productos (con confirmación antes de borrar)
- Activar / desactivar productos sin eliminarlos (para gestión de stock)
- Previsualización de imagen antes de guardar el producto
- Gestión de categorías
- Edición del perfil del negocio: nombre, WhatsApp, descripción, slug
- Link del catálogo copiable con un click
- QR descargable del catálogo (512×512px, listo para imprimir)
- Botón "Ver catálogo público" directo desde el dashboard
- Cerrar sesión disponible en el header del dashboard

---

## 💼 Planes

| Característica | Gratis | Pro |
|---|:---:|:---:|
| Productos | Ilimitados | Ilimitados |
| Categorías | Ilimitadas | Ilimitadas |
| Buscador y modal de producto | ✅ | ✅ |
| Botón WhatsApp por producto | ✅ | ✅ |
| Panel admin instalable (PWA) | ✅ | ✅ |
| QR descargable del catálogo | ✅ | ✅ |
| Link compartible del catálogo | ✅ | ✅ |
| Páginas individuales por producto | ❌ | ✅ |
| SEO automático (schema.org) | ❌ | ✅ |
| Filtros avanzados por precio | ❌ | ✅ |
| Dominio propio (.com.ar / .com) | ❌ | ✅ |
| Sin branding de TiendaBase | ❌ | ✅ |
| **Precio** | **$0** | **ARS $17.000/mes** |

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript 5 |
| Estilos | Tailwind CSS |
| Base de datos | PostgreSQL vía Supabase |
| Auth & Backend | Supabase Auth + Server Actions |
| Despliegue | Vercel |
| QR | qrcode 1.5 |
| Íconos | lucide-react |

---

## 🏗️ Estructura del proyecto

```text
sistema-de-catalogo/
├── src/
│   ├── app/
│   │   ├── page.tsx                        # Landing de la plataforma
│   │   ├── sitemap.ts                      # Sitemap dinámico (todos los catálogos)
│   │   ├── robots.ts                       # robots.txt (bloquea /admin)
│   │   ├── manifest.ts                     # PWA manifest
│   │   ├── (public)/
│   │   │   └── [account]/                  # Catálogo público por negocio
│   │   │       └── product/[slug]/         # Página individual de producto (Pro)
│   │   └── admin/
│   │       ├── login/                      # Inicio de sesión
│   │       ├── register/                   # Registro de nuevos negocios
│   │       ├── dashboard/                  # Panel principal
│   │       │   ├── nuevo/                  # Crear producto
│   │       │   ├── editar/[id]/            # Editar producto
│   │       │   └── categorias/             # Gestión de categorías
│   │       └── perfil/                     # Configuración del negocio + QR
│   ├── components/
│   │   ├── admin/                          # Componentes del panel
│   │   ├── catalog/                        # ProductGrid, ProductModal
│   │   ├── layout/                         # Header, Footer
│   │   └── ui/                             # WhatsAppButton y otros
│   ├── lib/
│   │   ├── plan/                           # plan.config.ts, plan.helpers.ts
│   │   ├── config/                         # getCatalogConfig
│   │   ├── storage/                        # Supabase Storage helpers
│   │   └── supabase/                       # Clientes server y public
│   ├── types/                              # Tipos TypeScript globales
│   └── utils/                              # Funciones utilitarias
└── public/                                 # Íconos PWA (icon.svg, icon-512x512.png)
```

---

## 🔐 Arquitectura de seguridad

**Row Level Security (RLS):** Aislamiento total de datos a nivel de base de datos. Cada tenant solo puede leer y modificar sus propios registros, incluso si intercepta las peticiones.

**Server Actions seguras:** Toda mutación de datos valida la sesión de Supabase Auth en el servidor antes de ejecutar cualquier operación. No hay endpoints REST expuestos.

**Aislamiento multitenant:** Cada negocio tiene su propia URL (`/nombre-del-negocio`) y sus datos completamente aislados del resto.

---

## 🚀 Correr el proyecto localmente

```bash
# 1. Clonar el repositorio
git clone https://github.com/LadislaoAlvarez16/sistema-de-catalogo.git
cd sistema-de-catalogo

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Crear un archivo .env.local con:
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# 4. Correr en modo desarrollo
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en el navegador.

Para acceder al panel de admin, registrá un nuevo negocio en `/admin/register`.

---

## 👤 Autor

**Ladislao Alvarez Deagustini**  
Técnico Universitario en Desarrollo Web — UNER (2025)

📧 ladislaoalvarez16@gmail.com  
🔗 [github.com/LadislaoAlvarez16](https://github.com/LadislaoAlvarez16)
