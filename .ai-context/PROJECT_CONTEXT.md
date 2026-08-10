# TiendaBase — Project Context

## Descripción
TiendaBase es un SaaS multitenant diseñado para democratizar el comercio digital para negocios pequeños, comercios y emprendedores. Les provee una plataforma profesional para generar catálogos web instalables (PWA), 100% autogestionables y orientados a potenciar ventas vía WhatsApp sin requerir intermediarios o pasarelas de pago costosas.

## Problema que resuelve
Actualmente, los pequeños emprendimientos distribuyen sus listas de productos a través de pesados y estáticos archivos PDF o galerías de WhatsApp que:
- Son difíciles de mantener actualizados ante la inflación o cambios de stock.
- No disponen de motores de búsqueda, dificultando la experiencia del comprador.
- Proyectan una imagen menos profesional frente a los consumidores.
- No posicionan en Google.

## Solución Propuesta (El Sistema)
TiendaBase proporciona:
1. **Un Catálogo Web Público (`/[account]`):** Responsivo, indexable (SEO) y con buscador en tiempo real, donde cada producto deriva en un mensaje automatizado hacia WhatsApp.
2. **Un Panel de Administración (`/admin`):** Una PWA móvil para que el dueño edite su comercio, agregue productos con fotos y obtenga links y QR compartibles en minutos.

## Planes de Negocio
- **Gratis:** Todo lo necesario para operar. Catálogo con buscador, botón de WhatsApp, descargas QR.
- **Pro:** Capacidades avanzadas (filtros de precio, páginas individuales por producto, SEO automático con Schema.org, dominio propio y *white-label* sin branding de TiendaBase).

## Stack Actual
- **Framework Front/Back:** Next.js 16 (App Router)
- **Base de Datos & Auth:** Supabase (PostgreSQL)
- **Despliegue:** Vercel
- **Estilos:** Tailwind CSS, `lucide-react`
