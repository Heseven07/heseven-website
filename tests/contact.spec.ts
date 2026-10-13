import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pick = (page: Page, text: string) =>
  page.locator('label.chip, label.seg').filter({ hasText: text }).first().click();
const visibleStep = (page: Page) =>
  page.evaluate(
    () => [...document.querySelectorAll('.qf-step')].findIndex((s) => !(s as HTMLElement).hidden) + 1,
  );

async function fillToLastStep(page: Page) {
  await pick(page, 'Shopify migration');
  await expect.poll(() => visibleStep(page)).toBe(2);
  await pick(page, 'GBP');
  await expect(page.locator('label.chip').filter({ hasText: '5k' }).first()).toContainText('£1k');
  await pick(page, '10k –');
  await expect.poll(() => visibleStep(page)).toBe(3);
  await page.fill('#qf-message', 'Migrating from WooCommerce with 2k products.');
  await page.locator('[data-qf-next]').click();
  await expect.poll(() => visibleStep(page)).toBe(4);
  await page.fill('#qf-name', 'Test User');
  await page.fill('#qf-email', 'test@example.com');
}

test.beforeEach(async ({ page }) => {
  await page.goto('/pages/contact-us');
});

test('quote form walks through 4 steps and shows success', async ({ page }) => {
  let payload: Record<string, string> = {};
  await page.route('**/api/contact', async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  await expect.poll(() => visibleStep(page)).toBe(1);
  await fillToLastStep(page);
  await page.locator('[data-qf-submit]').click();
  await expect(page.locator('[data-qf-success]')).toBeVisible();
  expect(payload).toMatchObject({
    need: 'Shopify migration',
    budget: '10k – 25k',
    currency: 'GBP',
    name: 'Test User',
    email: 'test@example.com',
  });
  expect(payload.company).toBe('');
});

test('quote form blocks empty required fields', async ({ page }) => {
  await page.locator('[data-qf-next]').click();
  await expect(page.locator('[data-qf-error]')).toContainText('pick one option');
  await expect.poll(() => visibleStep(page)).toBe(1);
});

test('quote form falls back to pre-filled email when the API fails', async ({ page }) => {
  await page.route('**/api/contact', (route) => route.fulfill({ status: 503, body: '{"ok":false}' }));
  await fillToLastStep(page);
  await page.locator('[data-qf-submit]').click();
  const link = page.locator('[data-qf-error] a');
  await expect(link).toHaveAttribute('href', /^mailto:info@heseven\.com\?subject=Project%20enquiry/);
});

test('contact form steps have no accessibility violations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  for (let step = 1; step <= 4; step++) {
    const results = await new AxeBuilder({ page })
      .include('.qf-card')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations, `step ${step}`).toEqual([]);
    if (step === 1) await pick(page, 'New Shopify store');
    if (step === 2) await pick(page, 'Not sure yet');
    if (step === 3) {
      await page.fill('#qf-message', 'A reasonably long message.');
      await page.locator('[data-qf-next]').click();
    }
    if (step < 4) await expect.poll(() => visibleStep(page)).toBe(step + 1);
  }
});
