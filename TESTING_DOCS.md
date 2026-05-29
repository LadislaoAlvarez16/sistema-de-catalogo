# Documentación de Testing y Resoluciones - TiendaBase

## 1. Estrategia de Testing
Se implementó una estrategia de testing pragmática enfocada en aportar el mayor valor con el menor mantenimiento, respetando la arquitectura de Next.js (App Router) y Supabase SSR.

- **Unit Testing (Jest)**: Enfocado en lógica de negocio pura y validaciones de Server Actions sin tocar la base de datos (aislamiento con Mocks).
- **E2E Testing (Playwright)**: Enfocado en el flujo crítico de negocio (registro de comercios) interactuando con el sistema real para garantizar la integración correcta entre UI, Servidor y Base de Datos.

## 2. Tests Unitarios (Jest)

### Desafío 2.1: Incompatibilidad de Entradas en Server Actions
- **Problema:** El test inicial intentó enviar un objeto plano (`{ name, slug, email }`) a la Server Action `registerUser`, pero Next.js en producción envía un objeto nativo del navegador.
- **Solución:** Evitamos crear wrappers artificiales. Refactorizamos el test para instanciar un `FormData` nativo, inyectar los datos mediante `.append()` y probar la función en las mismas condiciones que el entorno de producción.

### Desafío 2.2: Resolución de Alias de Next.js
- **Problema:** Jest fallaba con un error de módulo no encontrado (`Cannot find module '@/'...`) al intentar importar utilidades o el cliente de Supabase, debido a que no comprendía los Path Aliases configurados en `tsconfig.json`.
- **Solución:** Se añadió la propiedad `moduleNameMapper` en `jest.config.ts` (`'^@/(.*)$': '<rootDir>/src/$1'`) para alinear la resolución de módulos de Jest con la de TypeScript.

### Desafío 2.3: Fragilidad del Mock y Falta de Validación
- **Problema:** El mock de Supabase (`.single()`) retornaba `undefined`, rompiendo la desestructuración. Al mismo tiempo, el test reveló que la Server Action real no validaba el formato del slug, permitiendo espacios y caracteres inválidos.
- **Solución:** 
  1. Se robusteció el mock para retornar un objeto seguro por defecto (`{ data: null, error: null }`).
  2. Se implementó una validación manual mediante Regex directamente en la Server Action para asegurar que el slug contenga solo minúsculas, números y guiones, retornando un error estructurado `{ error: string }` antes de ejecutar cualquier consulta.

## 3. Tests End-to-End (Playwright)

### Desafío 3.1: Timeouts por Compilación On-Demand
- **Problema:** El primer test falló por un Timeout de 30s al intentar navegar a `/admin/register`. Next.js (en modo desarrollo) compila las rutas bajo demanda, lo que excede el tiempo de espera estándar de Playwright.
- **Solución:** Se configuró el bloque `webServer` en `playwright.config.ts` para que Playwright administre el ciclo de vida de `npm run dev` y espere pacientemente la compilación inicial. Se incrementó el timeout global a 60 segundos para evitar flaky tests.

### Desafío 3.2: Selectores Desalineados y Reglas de Formulario
- **Problema:** El test se quedaba esperando el input `name="name"`, el cual no existía. Además, el test inyectaba una contraseña de 6 caracteres, pero la UI requería un mínimo de 8.
- **Solución:** Inspección directa del código fuente (`RegisterForm.tsx`). Se actualizaron los selectores en Playwright para coincidir con la realidad (`name="businessName"`) y se ajustaron los datos de prueba (`"12345678"`) para respetar las reglas de negocio del frontend.

### Desafío 3.3: Redirección Silenciosa Bloqueada (Bug Arquitectónico)
- **Problema:** El registro era exitoso y la UI mostraba el dashboard, pero la URL del navegador se quedaba atascada en `http://localhost:3000/admin/register`. El test fallaba al afirmar `expect(page).toHaveURL(...)`.
- **Solución:** Se descubrió que la función `redirect("/admin/dashboard")` de Next.js estaba ubicada dentro de un bloque `try/catch` en la Server Action. Dado que `redirect` funciona lanzando una excepción interna (`NEXT_REDIRECT`), el `catch` la estaba atrapando por error. Se movió el `redirect()` fuera del bloque `try`, restaurando el ciclo de navegación nativo de Next.js y solucionando un bug crítico de UX.

## 4. Lecciones Arquitectónicas (Key Takeaways)

- **Testear la Realidad:** Adaptar los tests al código (ej. usar `FormData`) y no el código a los tests (evitar wrappers innecesarios).
- **Validación Defensiva:** Nunca confiar en los inputs del cliente. Las Server Actions deben validar los datos (ej. formato de Slugs) explícitamente antes de tocar la base de datos.
- **Manejo de Errores vs. Control de Flujo:** En Next.js App Router, funciones como `redirect()` y `notFound()` operan lanzando errores. Nunca deben colocarse dentro de un bloque `try/catch` genérico destinado a atrapar fallos de base de datos.
- **Observabilidad en CI:** Configurar capturas de pantalla o volcados de logs en Playwright en caso de fallo es vital para diagnosticar errores sin necesidad de adivinar el estado de la UI.
