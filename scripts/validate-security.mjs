import { chromium, expect } from '@playwright/test';
import { applyHostingHeaders } from './hosting-test-context.mjs';
const browser = await chromium.launch();
try {
  const context = await browser.newContext();
  await applyHostingHeaders(context);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:3000');
  const blocked = await page.evaluate(async () => {
    const events = [];
    document.addEventListener('securitypolicyviolation', e => events.push(e.effectiveDirective));
    const script = document.createElement('script');
    script.textContent = 'window.__untrustedScriptExecuted = true';
    document.body.append(script);
    await new Promise(resolve => setTimeout(resolve, 100));
    return { executed: !!window.__untrustedScriptExecuted, events };
  });
  expect(blocked.executed).toBe(false);
  expect(blocked.events).toContain('script-src-elem');
  await page.evaluate(() => {
    localStorage.setItem('revsafe_user_session', '{"id":"fake","name":{}}');
    localStorage.setItem('revsafe_active_comparison', '{"invalid":true}');
    localStorage.setItem('revsafe_anon_favs', '[null,{},"not-a-product"]');
  });
  await page.reload();
  await expect(page.getByRole('button', { name: 'Entrar', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
  await context.close();
  console.log('CSP blocked an untrusted inline script; malformed local storage was handled without JavaScript errors.');
} finally { await browser.close(); }
