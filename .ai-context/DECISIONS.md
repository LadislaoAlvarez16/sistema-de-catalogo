# TiendaBase — Decisions

Registro de decisiones técnicas con su justificación.

---

## 001 — Next.js (App Router) y Vercel
**Decisión:** Utilizar Next.js con el App Router y hospedar la plataforma en Vercel.
**Descartado:** Create React App, Single Page Applications puras o servidores Node/Express independientes.
**Por qué:** 
- El catálogo público requiere excelente SEO, indexación por Google y carga instantánea, lo cual es nativo con SSG/SSR en Next.js.
- Vercel ofrece una integración fluida y zero-config para este stack.

## 002 — Backend como Servicio con Supabase
**Decisión:** Utilizar Supabase (PostgreSQL + Auth + Storage).
**Descartado:** Crear un backend custom desde cero con NestJS o Express.
**Por qué:**
- Al ser un SaaS, delegar la autenticación, la seguridad (RLS) y la gestión de bases de datos acelera el desarrollo (Time-to-Market).
- Disminuye la carga operativa de mantenimiento de un backend separado.

## 003 — Supabase Row Level Security (RLS)
**Decisión:** Aplicar el aislamiento multitenant puramente a través de RLS en base de datos.
**Descartado:** Validaciones exclusivamente a nivel de capa de aplicación (middlewares/servicios).
**Por qué:**
- Es a prueba de balas. Si un bug expone una consulta de base de datos sin filtrar, PostgreSQL bloqueará automáticamente el acceso a filas de otro inquilino gracias a RLS.

## 004 — Tailwind CSS para Estilos
**Decisión:** Tailwind CSS.
**Descartado:** Styled Components, CSS Modules o frameworks de UI pesados.
**Por qué:**
- Permite construir diseños mobile-first altamente iterativos.
- Es el estándar *de facto* dentro del ecosistema moderno de Next.js, proveyendo builds extremadamente optimizados.

## 005 — PWA para el Panel de Administración
**Decisión:** Convertir el `/admin` en una aplicación instalable (PWA).
**Descartado:** Aplicación nativa separada (React Native/Flutter).
**Por qué:**
- Evita el costo de mantener apps nativas en las tiendas de Apple y Google.
- Los dueños de negocios gestionan sus inventarios sobre la marcha; un acceso rápido desde el Home Screen es suficiente.
