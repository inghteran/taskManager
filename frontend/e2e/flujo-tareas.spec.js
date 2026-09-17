import { test, expect } from '@playwright/test';

test('un usuario puede crear una tarea y verla en la lista', async ({ page }) => {
  // 1. Interceptar solo llamadas de red Fetch/XHR (ignora archivos JS/TSX de React)
  await page.route('**/*', async (route) => {
    const req = route.request();
    const type = req.resourceType();
    const url = req.url();

    // Si NO es una petición de datos (Fetch/XHR), dejar que Vite sirva el archivo normal
    if (type !== 'fetch' && type !== 'xhr') {
      return route.continue();
    }

    // Interceptar Login
    if (url.includes('login')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'fake-jwt-token' }),
      });
    }

    // Interceptar Tareas en el Backend
    if (url.includes('tasks')) {
      if (req.method() === 'GET') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      }
      if (req.method() === 'POST') {
        const postData = req.postDataJSON() || {};
        return route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 1, text: postData.text || 'Comprar pan', completed: false }),
        });
      }
    }

    return route.continue();
  });

  // 2. Cargar la página
  await page.goto('http://localhost:5173/');

  // 3. Detectar vista activa
  const firstInput = page.locator('input').first();
  await expect(firstInput).toBeVisible({ timeout: 10000 });

  const inputCount = await page.locator('input').count();

  // Si hay 2 o más inputs, estamos en el Login
  if (inputCount >= 2) {
    await page.locator('input').nth(0).fill('usuario@test.com');
    await page.locator('input').nth(1).fill('123456');
    await page.locator('button').first().click();
  }

  // 4. Crear la Tarea
  const taskInput = page.locator('input').first();
  await expect(taskInput).toBeVisible({ timeout: 10000 });
  await taskInput.fill('Comprar pan');
  await page.locator('button').first().click();

  // 5. Confirmar que aparece en pantalla
  await expect(page.getByText('Comprar pan')).toBeVisible({ timeout: 10000 });
});