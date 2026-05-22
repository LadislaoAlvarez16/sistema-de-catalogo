# 🗂️ TiendaBase — Plataforma SaaS Multinivel

Plataforma SaaS para la gestión y publicación de catálogos digitales de productos, orientada a comercios y negocios que quieren reemplazar los PDFs o listas de WhatsApp por un catálogo profesional, rápido, instalable en celulares y autogestionable.

🔗 **Demo en producción:** [sistema-de-catalogo.vercel.app/almacen-deco](https://sistema-de-catalogo.vercel.app/almacen-deco)

---

## ¿Qué problema resuelve?

Muchos negocios pequeños y medianos comparten sus productos por PDF o imágenes de WhatsApp: difícil de actualizar, sin buscador, sin precios claros, mala experiencia para el cliente. Este sistema les da un catálogo web profesional con panel de administración propio e instalable (PWA), sin depender de un desarrollador para cada cambio.

---

## ✨ Funcionalidades principales

### Panel de Administración (`/admin`)
- **App Instalable (PWA):** El dueño puede instalar el panel en la pantalla de inicio de su celular para acceso directo.
- **Autogestión total:** Formulario seguro para editar nombre del negocio, número de WhatsApp y descripción.
- Carga y edición de productos (con prevención de borrado accidental).
- Gestión de categorías y links rápidos para compartir el catálogo.
- Control total sin necesidad de conocimientos técnicos.

### Catálogo público
- Visualización de productos con imagen, nombre, precio y descripción.
- **Buscador inteligente habilitado para todos los planes.**
- **Modal flotante con detalle del producto para todos los planes.**
- **Botón de WhatsApp directo** en la tarjeta con mensaje prearmado por producto para máxima conversión.
- Filtros avanzados por categoría y rango de precio (plan Pro).
- Estados vacíos (empty states) amigables y manejo de errores 404 limpio.
- Diseño responsive optimizado para celular y desktop.

---

## 💼 Planes disponibles (Actualizado)

| Característica | Básico | Medio | Pro |
|---|:---:|:---:|:---:|
| Productos visibles | Hasta 30 | Hasta 100 | Hasta 2.000 |
| Categorías | Hasta 5 | Hasta 10 | Ilimitadas |
| Dominio propio (.com.ar) | ❌ | ✅ | ✅ |
| Buscador y ordenamiento | ✅ | ✅ | ✅ |
| Modal flotante de producto | ✅ | ✅ | ✅ |
| Filtros avanzados (precio) | ❌ | ❌ | ✅ |
| URL individual por producto | ❌ | ❌ | ✅ |
| SEO básico por producto | ❌ | ❌ | ✅ |
| Botón WhatsApp por producto | ✅ | ✅ | ✅ |
| Autogestión de Perfil | ✅ | ✅ | ✅ |
| Panel Instalable (PWA) | ✅ | ✅ | ✅ |

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS |
| Base de datos | PostgreSQL |
| Backend & Auth | Supabase |
| Despliegue | Vercel |

---

## 🏗️ Arquitectura

```text
sistema-de-catalogo/
├── src/
│   ├── app/
│   │   ├── [tienda]/          # Catálogo público por negocio
│   │   │   └── [producto]/    # Página individual de producto (plan Pro)
│   │   └── admin/             # Panel de administración protegido (PWA)
│   ├── components/            # Componentes reutilizables
│   └── lib/                   # Configuración de Supabase y Server Actions
├── public/                    # Íconos SVG y Manifest de la PWA
└── ...configuración Next.js, ESLint, TypeScript

🚀 Correr el proyecto localmente

# 1. Clonar el repositorio
git clone [https://github.com/LadislaoAlvarez16/sistema-de-catalogo.git](https://github.com/LadislaoAlvarez16/sistema-de-catalogo.git)
cd sistema-de-catalogo

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Crear un archivo .env.local con:
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima

# 4. Correr en modo desarrollo
npm run dev

Abrí http://localhost:3000 en el navegador.

📌 Características técnicas destacadas
Seguridad RLS (Row Level Security): Aislamiento total de datos en base de datos. Un tenant jamás puede modificar o borrar datos de otro, incluso interceptando las peticiones.

Server Actions Seguras: Toda la mutación de datos valida la sesión nativa por Supabase Auth en el servidor antes de ejecutar.

Arquitectura multitenant: Cada negocio tiene su propia URL (/nombre-del-local) y datos aislados.

Progressive Web App (PWA): manifest nativo para instalación mobile.

Tipado estricto con TypeScript.


👤 Autor
Ladislao Alvarez Deagustini Técnico Universitario en Desarrollo Web — UNER (2025)

📧 ladislaoalvarez16@gmail.com

🔗 github.com/LadislaoAlvarez16