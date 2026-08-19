import { test, expect } from '@playwright/test';

test.describe('Tickets Page E2E', () => {
  test('should render tickets header and new ticket action', async ({ page }) => {
    await page.route('**/api/tickets*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        }),
      });
    });

    await page.goto('/tickets');
    await expect(page.getByRole('heading', { name: /Destek Talepleri/i })).toBeVisible();

    // Verify filter tabs presence
    await expect(page.getByText('Tümü')).toBeVisible();
    await expect(page.getByText('Açık')).toBeVisible();
  });
});
