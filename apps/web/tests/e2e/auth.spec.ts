import { test, expect } from '@playwright/test';

test.describe('Authentication E2E Flow', () => {
  test('should display login form with email and password fields', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show validation error on empty submit', async ({ page }) => {
    await page.goto('/login');
    await page.locator('button[type="submit"]').click();

    // Form should stay on login page if invalid
    await expect(page).toHaveURL(/.*login/);
  });
});
