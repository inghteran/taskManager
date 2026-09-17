# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: flujo-tareas.spec.js >> un usuario puede crear una tarea y verla en la lista
- Location: e2e\flujo-tareas.spec.js:3:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('input').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('input').first() with timeout 10000ms
  - waiting for locator('input').first()

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('un usuario puede crear una tarea y verla en la lista', async ({ page }) => {
  4  |   // 1. Interceptar solo llamadas de red Fetch/XHR (ignora archivos JS/TSX de React)
  5  |   await page.route('**/*', async (route) => {
  6  |     const req = route.request();
  7  |     const type = req.resourceType();
  8  |     const url = req.url();
  9  | 
  10 |     // Si NO es una petición de datos (Fetch/XHR), dejar que Vite sirva el archivo normal
  11 |     if (type !== 'fetch' && type !== 'xhr') {
  12 |       return route.continue();
  13 |     }
  14 | 
  15 |     // Interceptar Login
  16 |     if (url.includes('login')) {
  17 |       return route.fulfill({
  18 |         status: 200,
  19 |         contentType: 'application/json',
  20 |         body: JSON.stringify({ token: 'fake-jwt-token' }),
  21 |       });
  22 |     }
  23 | 
  24 |     // Interceptar Tareas en el Backend
  25 |     if (url.includes('tasks')) {
  26 |       if (req.method() === 'GET') {
  27 |         return route.fulfill({
  28 |           status: 200,
  29 |           contentType: 'application/json',
  30 |           body: JSON.stringify([]),
  31 |         });
  32 |       }
  33 |       if (req.method() === 'POST') {
  34 |         const postData = req.postDataJSON() || {};
  35 |         return route.fulfill({
  36 |           status: 201,
  37 |           contentType: 'application/json',
  38 |           body: JSON.stringify({ id: 1, text: postData.text || 'Comprar pan', completed: false }),
  39 |         });
  40 |       }
  41 |     }
  42 | 
  43 |     return route.continue();
  44 |   });
  45 | 
  46 |   // 2. Cargar la página
  47 |   await page.goto('http://localhost:5173/');
  48 | 
  49 |   // 3. Detectar vista activa
  50 |   const firstInput = page.locator('input').first();
> 51 |   await expect(firstInput).toBeVisible({ timeout: 10000 });
     |                            ^ Error: expect(locator).toBeVisible() failed
  52 | 
  53 |   const inputCount = await page.locator('input').count();
  54 | 
  55 |   // Si hay 2 o más inputs, estamos en el Login
  56 |   if (inputCount >= 2) {
  57 |     await page.locator('input').nth(0).fill('usuario@test.com');
  58 |     await page.locator('input').nth(1).fill('123456');
  59 |     await page.locator('button').first().click();
  60 |   }
  61 | 
  62 |   // 4. Crear la Tarea
  63 |   const taskInput = page.locator('input').first();
  64 |   await expect(taskInput).toBeVisible({ timeout: 10000 });
  65 |   await taskInput.fill('Comprar pan');
  66 |   await page.locator('button').first().click();
  67 | 
  68 |   // 5. Confirmar que aparece en pantalla
  69 |   await expect(page.getByText('Comprar pan')).toBeVisible({ timeout: 10000 });
  70 | });
```