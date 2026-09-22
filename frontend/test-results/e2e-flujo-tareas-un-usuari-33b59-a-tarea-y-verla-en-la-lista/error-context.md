# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\flujo-tareas.spec.js >> un usuario puede crear una tarea y verla en la lista
- Location: e2e\flujo-tareas.spec.js:3:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Comprar pan')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Comprar pan') with timeout 10000ms
  - waiting for getByText('Comprar pan')

```

```yaml
- button "🚪 Cerrar Sesión"
- banner:
  - heading "Task Manager Yeah" [level=1]
  - paragraph: Mi primera App
- textbox "Escribir una nueva tarea"
- button "Agregar"
- paragraph: No hay tareas todavía. Agrega una nueva tarea.
- contentinfo: "Total: 0 Completadas: 0 Pendientes: 0"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('un usuario puede crear una tarea y verla en la lista', async ({ page }) => {
  4  |   // 1. Ir a la aplicación
  5  |   await page.goto('http://localhost:5173/');
  6  | 
  7  |   // 2. Detectar si estamos en la pantalla de Login
  8  |   const inputs = page.locator('input');
  9  |   await expect(inputs.first()).toBeVisible({ timeout: 10000 });
  10 | 
  11 |   if ((await inputs.count()) >= 2) {
  12 |     // Llenar correo y contraseña
  13 |     await inputs.nth(0).fill('test@example.com');
  14 |     await inputs.nth(1).fill('password123');
  15 |     
  16 |     // Hacer clic específicamente en el botón del formulario de Login (Submit)
  17 |     await page.locator('form button, button[type="submit"]').first().click();
  18 | 
  19 |     // Esperar a que la sesión inicie y aparezca la interfaz principal
  20 |     await expect(page.getByText('Cerrar Sesión')).toBeVisible({ timeout: 10000 });
  21 |   }
  22 | 
  23 |   // 3. Crear la Tarea
  24 |   // Seleccionamos el campo de texto de la tarea
  25 |   const taskInput = page.locator('input[type="text"]').last();
  26 |   await taskInput.fill('Comprar pan');
  27 | 
  28 |   // Hacemos clic en el botón "Agregar" (o submit de la tarea), NO en Cerrar Sesión
  29 |   const addButton = page.getByRole('button', { name: /agregar|crear|\+/i });
  30 |   if (await addButton.isVisible()) {
  31 |     await addButton.click();
  32 |   } else {
  33 |     // Si no tiene texto "Agregar", hace clic en el botón junto al input
  34 |     await taskInput.locator('..').locator('button').click();
  35 |   }
  36 | 
  37 |   // 4. Confirmar que la tarea aparece en la lista
> 38 |   await expect(page.getByText('Comprar pan')).toBeVisible({ timeout: 10000 });
     |                                               ^ Error: expect(locator).toBeVisible() failed
  39 | });
```