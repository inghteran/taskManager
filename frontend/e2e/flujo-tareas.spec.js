import { test, expect } from '@playwright/test';

test('un usuario puede crear una tarea y verla en la lista', async ({ page }) => {
  // 1. Ir a la aplicación
  await page.goto('http://localhost:5173/');

  // 2. Detectar si estamos en la pantalla de Login
  const inputs = page.locator('input');
  await expect(inputs.first()).toBeVisible({ timeout: 10000 });

  if ((await inputs.count()) >= 2) {
    // Llenar correo y contraseña
    await inputs.nth(0).fill('test@example.com');
    await inputs.nth(1).fill('password123');
    
    // Hacer clic específicamente en el botón del formulario de Login (Submit)
    await page.locator('form button, button[type="submit"]').first().click();

    // Esperar a que la sesión inicie y aparezca la interfaz principal
    await expect(page.getByText('Cerrar Sesión')).toBeVisible({ timeout: 10000 });
  }

  // 3. Crear la Tarea
  // Seleccionamos el campo de texto de la tarea
  const taskInput = page.locator('input[type="text"]').last();
  await taskInput.fill('Comprar pan');

  // Hacemos clic en el botón "Agregar" (o submit de la tarea), NO en Cerrar Sesión
  const addButton = page.getByRole('button', { name: /agregar|crear|\+/i });
  if (await addButton.isVisible()) {
    await addButton.click();
  } else {
    // Si no tiene texto "Agregar", hace clic en el botón junto al input
    await taskInput.locator('..').locator('button').click();
  }

  // 4. Confirmar que la tarea aparece en la lista
  await expect(page.getByText('Comprar pan')).toBeVisible({ timeout: 10000 });
});