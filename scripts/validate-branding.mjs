import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { applyHostingHeaders } from './hosting-test-context.mjs';
const browser = await chromium.launch();
try {
  for (const port of [3000, 3001]) {
    const context = await browser.newContext({ viewport: { width: 320, height: 800 } });
    if (port === 3000) await applyHostingHeaders(context);
    const page = await context.newPage();
    await page.goto(`http://localhost:${port}`);
    const icon = page.locator('link[rel="icon"][type="image/png"]');
    await expect(icon).toHaveCount(1);
    const href = await icon.getAttribute('href');
    expect(href).toMatch(/^\/icon\.png\?/);
    const response = await context.request.get(new URL(href, page.url()).href);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
    expect((await response.body()).subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
    const decoded = await page.evaluate(async href => {
      const img = new Image(); img.src = href; await img.decode();
      return { width: img.naturalWidth, height: img.naturalHeight };
    }, href);
    expect(decoded).toEqual({ width: 64, height: 64 });
    for (const dark of [false, true]) {
      if (dark) await page.getByRole('button', { name: 'Alternar tema claro e escuro' }).click();
      const button = page.getByRole('button', { name: 'Buscar', exact: true });
      await button.hover(); await page.waitForTimeout(850);
      await expect(button).toHaveCSS('color', 'rgb(255, 255, 255)');
      await expect(button.locator('.circle')).toHaveCSS('opacity', '1');
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
      const headerBounds = await page.locator('header button').evaluateAll(buttons => buttons.map(b => ({ left: b.getBoundingClientRect().left, right: b.getBoundingClientRect().right })));
      expect(headerBounds.every(b => b.left >= 0 && b.right <= 320)).toBe(true);
      if (port === 3000) {
        const audit = await new AxeBuilder({ page }).include('.animated-button').withRules(['color-contrast']).analyze();
        expect(audit.violations).toEqual([]);
        await page.screenshot({ path: `artifacts/button-${dark ? 'dark' : 'light'}-hover.png` });
      }
    }
    console.log(`${port === 3000 ? 'Static export' : 'Next dev'}: versioned favicon decoded; white button text, hover and 320px layout passed.`);
    await context.close();
  }
} finally { await browser.close(); }
