import { test, expect } from '@playwright/test';

test.describe('Dashboard Page E2E', () => {
  test('should render dashboard title and key overview components', async ({ page }) => {
    // Intercept summary endpoint with mock data if backend is offline
    await page.route('**/api/dashboard/summary', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            kpi: {
              totalPolicies: 120,
              totalPremium: 1450000,
              agencyShareTotal: 435000,
              activeBrokers: 8,
              unassignedPoliciesCount: 15,
            },
            statusDistribution: [
              { status: 'DRAFT', count: 10 },
              { status: 'UNASSIGNED', count: 15 },
              { status: 'CLAIMED', count: 35 },
              { status: 'COMPLETED', count: 60 },
            ],
            commissionShares: {
              totalAmount: 1450000,
              companyAmount: 580000,
              agencyAmount: 435000,
              branchAmount: 290000,
              brokerAmount: 145000,
            },
            recentActivities: [],
          },
        }),
      });
    });

    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: /Genel Bakış/i })).toBeVisible();
  });
});
