# TiendaBase — E2E Smoke Tests & QA Guidelines

Este documento detalla los guiones de prueba manuales (Smoke Tests) críticos para validar la continuidad de servicio del SaaS, enfocándose en los flujos principales (Core Loops).

## Smoke Test 1: Onboarding de Tenant (Nuevo Negocio)
Este test valida que la conversión de un nuevo usuario funcione correctamente.

1. Navegar a `/admin/register`.
2. Llenar los datos de comercio. El sistema debe validar que el **slug** sea único.
3. Tras registrarse, el usuario debe ser llevado automáticamente a `/admin/dashboard`.
4. El perfil (tienda) debe haber sido inicializado y guardado con el usuario actual atado por ID.

## Smoke Test 2: ABM de Productos y Catálogo Público
Valida que el panel de administración impacte correctamente la vista pública y que RLS (Row Level Security) funcione.

1. Loguearse en el panel de administrador del negocio `A`.
2. Crear un producto nuevo llamado "Test Producto A" y cargar una foto.
3. Verificar que el producto aparezca listado en `/admin/dashboard`.
4. En otra ventana de incógnito, navegar a la ruta pública del negocio `/[slug-del-negocio-A]`.
5. Comprobar que "Test Producto A" está visible y el botón de WhatsApp abre correctamente con el mensaje formateado.
6. **(Prueba de Aislamiento):** En la ventana de incógnito, navegar al catálogo de otro negocio `/[slug-del-negocio-B]`. Verificar que "Test Producto A" **NO** aparece aquí.

## Smoke Test 3: Plan Pro (SEO y Ruteo Dinámico)
Valida características exclusivas del plan de pago (de estar implementado un flag de prueba).

1. Activar rol o flag "Pro" para el negocio en base de datos.
2. Acceder al catálogo público y navegar a un producto individual `/[slug]/product/[product-slug]`.
3. Revisar el código fuente (Inspector de elementos) y comprobar que:
   - Se inyecta correctamente el JSON-LD de `schema.org/Product`.
   - Se genera el tag `og:image` en el Head de la página para compartir enriquecido en RRSS.
