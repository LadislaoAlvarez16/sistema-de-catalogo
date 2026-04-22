# 🗂️ Sistema de Catálogo — Plataforma SaaS Multinivel

Plataforma SaaS para la gestión y publicación de catálogos digitales de productos, orientada a comercios y negocios que quieren reemplazar los PDFs o listas de WhatsApp por un catálogo profesional, rápido y autogestioable.

🔗 **Demo en producción:** [sistema-de-catalogo.vercel.app/almacen-deco](https://sistema-de-catalogo.vercel.app/almacen-deco)

---

## ¿Qué problema resuelve?

Muchos negocios pequeños y medianos comparten sus productos por PDF o imágenes de WhatsApp: difícil de actualizar, sin buscador, sin precios claros, mala experiencia para el cliente. Este sistema les da un catálogo web profesional con panel de administración propio, sin depender de un desarrollador para cada cambio.

---

## ✨ Funcionalidades principales

### Panel de Administración (`/admin`)
- Carga y edición de productos (nombre, imagen, precio, descripción)
- Gestión de categorías
- Edición de la descripción e información del negocio
- Control total sin necesidad de conocimientos técnicos

### Catálogo público
- Visualización de productos con imagen, nombre, precio y descripción
- Buscador inteligente y ordenamiento (A-Z, por precio)
- Filtros avanzados por categoría y rango de precio (plan Pro)
- Modal flotante con detalle del producto
- Botón de WhatsApp directo con mensaje prearmado por producto
- Páginas individuales por producto con URL propia (plan Pro)
- Diseño responsive optimizado para celular y desktop
- Certificado SSL y hosting seguro

---

## 💼 Planes disponibles

| Característica | Básico | Medio | Pro |
|---|:---:|:---:|:---:|
| Productos visibles | Hasta 30 | Hasta 100 | Hasta 2.000 |
| Categorías | Hasta 5 | Hasta 10 | Ilimitadas |
| Dominio propio (.com.ar) | ❌ | ✅ | ✅ |
| Buscador y ordenamiento | ❌ | ✅ | ✅ |
| Modal flotante de producto | ❌ | ✅ | ✅ |
| Filtros avanzados (precio) | ❌ | ❌ | ✅ |
| URL individual por producto | ❌ | ❌ | ✅ |
| SEO básico por producto | ❌ | ❌ | ✅ |
| Botón WhatsApp por producto | ✅ | ✅ | ✅ |
| Responsive + SSL | ✅ | ✅ | ✅ |
| Panel de autogestión `/admin` | ✅ | ✅ | ✅ |

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS |
| Base de datos | PostgreSQL |
| Backend as a Service | Supabase |
| Despliegue | Vercel |

---

## 🏗️ Arquitectura

```
sistema-de-catalogo/
├── src/
│   ├── app/
│   │   ├── [tienda]/          # Catálogo público por negocio
│   │   │   └── [producto]/    # Página individual de producto (plan Pro)
│   │   └── admin/             # Panel de administración protegido
│   ├── components/            # Componentes reutilizables
│   └── lib/                   # Configuración de Supabase y utilidades
├── public/
└── ...configuración Next.js, ESLint, TypeScript
```

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

# 4. Correr en modo desarrollo
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en el navegador.

---

## 📌 Características técnicas destacadas

- **Autenticación y control de acceso por roles** — el panel `/admin` está protegido y solo accesible para el administrador de cada tienda
- **Arquitectura multitenant** — cada negocio tiene su propia URL (`/nombre-del-local`) y datos aislados
- **Tipado estricto con TypeScript** — todo el proyecto (~99%) está en TypeScript
- **Rutas dinámicas** — URLs amigables para tiendas y productos individuales
- **Optimización SEO** — metadatos dinámicos por producto para posicionamiento en Google (plan Pro)
- **116+ commits** de desarrollo continuo en producción

---

## 👤 Autor

**Ladislao Alvarez Deagustini**  
Técnico Universitario en Desarrollo Web — UNER (2025)  
📧 ladislaoalvarez16@gmail.com  
🔗 [github.com/LadislaoAlvarez16](https://github.com/LadislaoAlvarez16)
