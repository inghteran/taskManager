import { test, expect } from '@playwright/test'

test('un usuario puede cargar la interfaz principal', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Task/i)
})