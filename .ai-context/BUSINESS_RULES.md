# TiendaBase — Business Rules

Reglas de negocio fundamentales del SaaS.

---

## BR-01 — Aislamiento Multitenant
**Contexto:** Los negocios (tenants) acceden a sus propios catálogos.
**Regla:** Un negocio nunca debe poder acceder o alterar productos, categorías o configuración de otro negocio. El aislamiento se ejerce en tres capas: URL semántica (`/[account]`), filtrado a nivel ORM (por ID de comercio), y Row Level Security (RLS) directo en base de datos PostgreSQL.

---

## BR-02 — Gestión y Visibilidad de Productos
**Contexto:** Un comercio quiere ocultar un producto en vez de borrarlo para mantener el stock.
**Regla:** El dueño puede desactivar (ocultar) temporalmente productos. Los productos inactivos NO deben aparecer en el catálogo público y los links directos a estos deben retornar un error/404 manejado limpiamente.
**Consecuencia:** Al borrar de forma definitiva, se pedirá una doble confirmación al usuario para evitar pérdida accidental.

---

## BR-03 — URL (Slug) Única por Negocio
**Contexto:** Registro de negocios.
**Regla:** El *slug* del negocio es su identificador de URL. Debe ser único en todo el sistema. Durante el registro, el sistema valida en tiempo real la disponibilidad del slug propuesto.

---

## BR-04 — Límite de Características por Plan (Gratis vs Pro)
**Contexto:** Funcionalidades avanzadas de acceso restringido.
**Regla:** El acceso a ciertas funcionalidades depende de la suscripción:
- **Gratis:** Botón WhatsApp por producto, modal de vista rápida, buscador, Panel PWA.
- **Pro:** Páginas de producto individuales, filtros avanzados por precio, SEO automático (schema), y uso de dominio propio.

---

## BR-05 — Comunicación Directa Cliente-Comercio
**Contexto:** Flujo de conversión o "venta".
**Regla:** TiendaBase no retiene ni procesa pagos (sin comisiones). Cada orden/pedido o consulta de producto se finaliza redirigiendo a la API de WhatsApp del negocio con un mensaje pre-formateado que incluye el producto y su variante (de aplicar).
