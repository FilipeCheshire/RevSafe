import { chromium, expect } from '@playwright/test';
import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const base = 'http://localhost:3220';
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const server = spawn(process.execPath, ['node_modules/serve/build/main.js', 'out', '-l', '3220'], { stdio: 'ignore' });
const errors = [];
const results = [];
let browser;

async function ready() {
  for (let attempt = 0; attempt < 80; attempt++) {
    if (server.exitCode !== null) throw Error(`Preview exited with ${server.exitCode}`);
    try { if ((await fetch(base)).ok) return; } catch {}
    await pause(100);
  }
  throw Error('Preview did not become ready');
}

async function login(page) {
  page.on('pageerror', error => errors.push(error.message));
  await page.route('https://images.unsplash.com/**', route => route.abort());
  await page.goto(base);
  await page.locator('#login-email').fill('scroll-test@example.com');
  await page.locator('#login-password').fill('demo');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await page.locator('[data-scroll-experience]').waitFor();
}

async function sceneSnapshot(page) {
  return page.evaluate(() => {
    const output = {};
    for (const element of document.querySelectorAll('[data-scene], [data-visual]')) {
      const key = element.getAttribute('data-scene') || element.getAttribute('data-visual');
      const style = getComputedStyle(element);
      output[key] = { opacity: Number(style.opacity), transform: style.transform };
    }
    return output;
  });
}

function sameFrame(a, b, tolerance = 0.7) {
  if (Object.keys(a).join() !== Object.keys(b).join()) return false;
  for (const key of Object.keys(a)) {
    if (Math.abs(a[key].opacity - b[key].opacity) > 0.025) return false;
    const numbers = value => value === 'none' ? [1, 0, 0, 1, 0, 0] : [...value.matchAll(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi)].map(match => Number(match[0]));
    const x = numbers(a[key].transform), y = numbers(b[key].transform);
    if (x.length !== y.length || x.some((value, index) => Math.abs(value - y[index]) > tolerance)) return false;
  }
  return true;
}

async function settle(page) {
  let previous = await sceneSnapshot(page);
  for (let attempt = 0; attempt < 24; attempt++) {
    await pause(65);
    const current = await sceneSnapshot(page);
    if (attempt > 2 && sameFrame(previous, current, 0.02)) return current;
    previous = current;
  }
  return previous;
}

async function progress(page, amount) {
  await page.evaluate(amount => {
    const element = document.querySelector('[data-scroll-experience]');
    const top = element.getBoundingClientRect().top + scrollY;
    const start = top - 64;
    const end = top + element.offsetHeight - innerHeight;
    scrollTo({ top: start + (end - start) * amount, behavior: 'instant' });
  }, amount);
  return settle(page);
}

async function noOverflow(page, label) {
  const size = await page.evaluate(() => ({ viewport: innerWidth, scroll: document.documentElement.scrollWidth }));
  expect(size.scroll, label).toBeLessThanOrEqual(size.viewport);
}

try {
  await ready();
  browser = await chromium.launch({ headless: true });
  for (const [width, height] of [[1440, 900], [390, 844], [320, 740], [768, 1024]]) {
    const context = await browser.newContext({ viewport: { width, height }, colorScheme: 'light' });
    const page = await context.newPage();
    await login(page);
    for (const dark of [false, true]) {
      if (dark) await page.getByRole('button', { name: 'Alternar tema claro e escuro' }).click();
      const baseline = new Map();
      for (const amount of [0, 0.5, 1]) {
        const frame = await progress(page, amount);
        baseline.set(amount, frame);
        await noOverflow(page, `${width}/${dark}/${amount}`);
        const top = await page.locator('[data-scroll-stage]').evaluate(el => el.getBoundingClientRect().top);
        expect(Math.abs(top - 64), `Sticky stage ${width}/${amount}`).toBeLessThan(3);
        const scene = amount === 0 ? 'explore' : amount === 0.5 ? 'analyze' : 'decide';
        expect(frame[scene], `${scene} exists`).toBeTruthy();
        expect(frame[scene].opacity, `${scene} visible`).toBeGreaterThan(0.8);
        const itemGroups = await page.locator('[data-stage-items]').evaluateAll(groups => groups.map(group => ({
          stage: group.getAttribute('data-stage-items'),
          opacity: Number(getComputedStyle(group).opacity),
          items: [...group.querySelectorAll('[data-item]')].map(item => item.getAttribute('data-item')),
        })));
        expect(itemGroups.find(group => group.stage === scene)?.opacity, 'Only the current act supplies its side items').toBeGreaterThan(.98);
        expect(itemGroups.filter(group => group.stage !== scene).every(group => group.opacity < .02)).toBe(true);
        const itemNames = itemGroups.flatMap(group => group.items);
        expect(new Set(itemNames).size, 'Each act uses different side items').toBe(itemNames.length);
        if (width === 1440 || width === 390) {
          await page.screenshot({ path: `artifacts/scroll-${width}-${dark ? 'dark' : 'light'}-${scene}.png` });
        }
        results.push({ width, height, dark, amount, frame });
      }
      expect(sameFrame(baseline.get(0), baseline.get(0.5)), 'Scroll transforms the scene').toBe(false);
      if (width === 1440 || width === 390) {
        for (const amount of [0.5, 0]) {
          const backwards = await progress(page, amount);
          expect(sameFrame(baseline.get(amount), backwards), `Reverse frame ${width}/${dark}/${amount}`).toBe(true);
        }
        await page.mouse.wheel(0, 280);
        await pause(200);
        expect(await page.evaluate(() => scrollY), 'Native wheel scroll works').toBeGreaterThan(0);
        await page.mouse.wheel(0, -280);
        await pause(200);
        await progress(page, 0.5);
        await page.getByRole('button', { name: /Alertas de segurança:/ }).click();
        await expect(page.getByRole('dialog')).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(page.getByRole('dialog')).toHaveCount(0);
      }
      await progress(page, 1);
      await page.locator('header').getByRole('button', { name: 'RevSafe — início', exact: true }).click();
      await expect.poll(() => page.evaluate(() => scrollY), { timeout: 3000 }).toBeLessThan(2);
      const restarted = await settle(page);
      expect(sameFrame(baseline.get(0), restarted), `Header home restores scene ${width}/${dark}`).toBe(true);
    }

    await page.getByRole('button', { name: /Voltar ao topo e rever/ }).click();
    await expect.poll(() => page.evaluate(() => scrollY), { timeout: 3500 }).toBeLessThan(2);
    expect((await settle(page)).explore.opacity, 'Bottom replay restores the opening').toBeGreaterThan(.98);
    const skip = page.locator('[data-skip-experience]').or(page.getByRole('button', { name: /Explorar produtos|Pular|Ir para categorias/i })).first();
    await skip.click();
    await expect.poll(() => page.locator('#home-categories').evaluate(el => el.getBoundingClientRect().top), { timeout: 3000 }).toBeLessThan(height * 0.5);
    await page.locator('header').getByRole('button', { name: 'RevSafe — início', exact: true }).click();
    await expect.poll(() => page.evaluate(() => scrollY), { timeout: 3000 }).toBeLessThan(2);
    await page.getByRole('searchbox', { name: 'Pesquisar produtos' }).fill('iPhone 15');
    await page.getByRole('button', { name: 'Buscar', exact: true }).click();
    await expect(page.locator('main').getByRole('button', { name: 'Ficha Técnica', exact: true })).toHaveCount(1);
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await login(page);
  await expect(page.getByRole('searchbox', { name: 'Pesquisar produtos' })).toBeVisible();
  const reduced = await page.locator('[data-scroll-experience]').evaluate(el => ({ height: el.offsetHeight, viewport: innerHeight }));
  expect(reduced.height, 'Reduced motion has no long pinned track').toBeLessThan(reduced.viewport * 2);
  const stagePosition = await page.locator('[data-scroll-stage]').evaluate(el => getComputedStyle(el).position);
  expect(stagePosition, 'Reduced motion is not pinned').not.toBe('sticky');
  await noOverflow(page, 'Reduced motion');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect.poll(() => page.locator('[data-scroll-stage]').evaluate(el => getComputedStyle(el).position)).toBe('sticky');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => page.locator('[data-scroll-stage]').evaluate(el => getComputedStyle(el).position)).not.toBe('sticky');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect.poll(() => page.locator('[data-scroll-stage]').evaluate(el => getComputedStyle(el).position)).toBe('sticky');
  await page.setViewportSize({ width: 844, height: 390 });
  await expect.poll(() => page.locator('[data-scroll-stage]').evaluate(el => getComputedStyle(el).position)).not.toBe('sticky');
  await noOverflow(page, 'Short landscape viewport');
  await page.screenshot({ path: 'artifacts/scroll-landscape.png', fullPage: true });
  await context.close();
  expect(errors, 'No JavaScript errors').toEqual([]);
  await writeFile('artifacts/scroll-experience-report.json', JSON.stringify({ results, errors }, null, 2));
  console.log(JSON.stringify({ states: results.length, widths: [320, 390, 768, 1440], reversible: true, reducedMotion: true, search: true, errors }, null, 2));
} finally {
  await browser?.close();
  server.kill();
}
