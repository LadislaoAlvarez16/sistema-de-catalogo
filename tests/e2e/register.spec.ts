import { test, expect } from '@playwright/test';

test('Debe registrar una nueva tienda exitosamente', async ({ page }) => {
  // 1. Navegar a /admin/register
  await page.goto('/admin/register');

  // 2 y 3. Llenar inputs y usar slug dinámico
  const uniqueSlug = `test-shop-${Date.now()}`;

  await page.fill('input[name="businessName"]', 'Mi Tienda E2E');
  await page.fill('input[name="slug"]', uniqueSlug);
  await page.fill('input[name="email"]', `${uniqueSlug}@test.com`);
  await page.fill('input[name="password"]', '12345678');

  // 4. Click en el botón submit
  await page.click('button[type="submit"]');

  // 5. Afirmar redirección
  try {
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 15000 });
  } catch (error) {
    const errorLocator = page.locator('form .bg-red-50, form .text-red-500').first();
    if (await errorLocator.isVisible()) {
      const errorMessage = await errorLocator.textContent();
      console.error('\n❌ ERROR EN LA UI CAPTURADO:', errorMessage?.trim(), '\n');
    }
    await page.screenshot({ path: 'test-results/error-screenshot.png' });
    throw error;
  }
});
