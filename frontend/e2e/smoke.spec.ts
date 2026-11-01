import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Churn Radar Smoke Test', () => {
  test('end-to-end user workflow: upload, validate, analyze, results, and rtl language switch', async ({
    page,
  }) => {
    // 1. Visit /
    await page.goto('/');
    await expect(page).toHaveTitle(/Churn Radar/i);

    // 2. Upload data/sample_upload.csv
    const filePath = path.resolve(__dirname, '../data/sample_upload.csv');
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: /drag and drop/i }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);

    // 3. Sees validation results on /check
    await page.waitForURL('**/check');
    await expect(page.getByText(/Required Columns Status|All required columns are present/i)).toBeVisible();
    await expect(page.getByText(/Contact Availability/i)).toBeVisible();

    // 4. Runs analysis
    const runBtn = page.getByRole('button', { name: /Run Analysis/i });
    await expect(runBtn).toBeEnabled();
    await runBtn.click();

    // 5. Sees results page with at least 1 customer
    await page.waitForURL('**/results/**', { timeout: 30000 });
    await expect(page.getByText(/Analysis Results|Total Customers/i)).toBeVisible();
    const customerRows = page.locator('tbody tr');
    await expect(customerRows.first()).toBeVisible({ timeout: 15000 });
    const count = await customerRows.count();
    expect(count).toBeGreaterThan(0);

    // 6. Switches to Arabic (RTL) and verifies dir=rtl
    const langBtn = page.getByRole('button', { name: /Switch to Arabic|العربية/i });
    await langBtn.click();
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');

    // 7. Goes back to English
    const backToEnBtn = page.getByRole('button', { name: /التبديل إلى الإنجليزية|English/i });
    await backToEnBtn.click();
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});

