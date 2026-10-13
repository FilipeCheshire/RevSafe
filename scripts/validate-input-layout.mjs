import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { applyHostingHeaders } from './hosting-test-context.mjs';
const browser = await chromium.launch();
try {
  for (const width of [320, 390, 1024, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, isMobile: width < 640, hasTouch: width < 640 });
    await applyHostingHeaders(context);
    const page = await context.newPage();
    const navigate = async tab => {
      if (width < 1280) await page.getByRole('button', { name: 'Abrir menu de navegação' }).click();
      await page.locator('header nav').getByRole('button', { name: tab, exact: true }).click();
    };
    await page.goto('http://localhost:3000');
    for (const dark of [false, true]) {
      if (dark) await page.getByRole('button', { name: 'Alternar tema claro e escuro' }).click();
      await page.waitForTimeout(250);
      const input = page.getByRole('searchbox', { name: 'Pesquisar produtos' });
      const original = await input.boundingBox();
      if (width < 640) await input.tap(); else await input.click();
      await input.fill('notebook'); await input.evaluate(i => i.select());
      const focused = await input.boundingBox();
      expect(focused.width).toBe(original.width);
      await expect(input).toHaveCSS('font-size', '16px');
      if (width < 640) {
        expect(focused.width).toBeGreaterThan(width - 100);
        expect((await page.getByRole('button', { name: 'Buscar', exact: true }).boundingBox()).y).toBeGreaterThanOrEqual(focused.y + focused.height);
      }
      const contrast = await new AxeBuilder({ page }).include('form[role="search"]').withRules(['color-contrast']).analyze();
      expect(contrast.violations).toEqual([]);
      if (width === 390) await page.screenshot({ path: `artifacts/search-focus-${dark ? 'dark' : 'light'}.png` });
      await input.press('Enter');
      await expect(page.locator('main').getByRole('button', { name: 'Ficha Técnica', exact: true })).toHaveCount(3);
      await navigate('Monte seu PC');
      const budget = page.getByRole('spinbutton', { name: 'Orçamento Pretendido' });
      const currency = budget.locator('..').getByText('R$', { exact: true });
      await expect(currency).toHaveCSS('white-space', 'nowrap');
      const currencyBox = await currency.boundingBox(), budgetBox = await budget.boundingBox();
      expect(currencyBox.y + currencyBox.height / 2).toBeCloseTo(budgetBox.y + budgetBox.height / 2, 0);
      expect(currencyBox.x + currencyBox.width).toBeLessThan(budgetBox.x);
      const badge = page.getByText('Compatível', { exact: true });
      await expect(badge).toHaveCSS('white-space', 'nowrap');
      const card = page.getByRole('heading', { name: 'Verificação de compatibilidade' }).locator('../..');
      expect(await card.evaluate(e => e.scrollWidth <= e.clientWidth)).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      if (width === 390) { await card.screenshot({ path: `artifacts/compatibility-${dark ? 'dark' : 'light'}.png` }); }
      await navigate('Início');
    }
    await navigate('Monte seu PC');
    await page.getByRole('button', { name: 'Trocar', exact: true }).first().click();
    await page.getByText('AMD Ryzen 5 5600 (Melhor Opção Econômica)', { exact: true }).click();
    await expect(page.getByText('Incompatível', { exact: true })).toHaveCSS('white-space', 'nowrap');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await context.close();
  }
  console.log('Search focus/selection/Enter, currency alignment and compatible/incompatible labels passed at 320, 390, 1024 and 1440px.');
} finally { await browser.close(); }
