import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';
import { applyHostingHeaders } from './hosting-test-context.mjs';
const browser = await chromium.launch(); const reports=[];
const money=text=>Number(text.replace(/[^0-9,]/g,'').replace(',','.'));
try {
  for(const width of [320,1440])for(const dark of [false,true]) {
    const context=await browser.newContext({viewport:{width,height:1000},permissions:['clipboard-read','clipboard-write']});await applyHostingHeaders(context);const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://localhost:3000');
    if(dark)await page.getByRole('button',{name:'Alternar tema claro e escuro'}).click();
    const navigate=async name=>{if(width<1280)await page.getByRole('button',{name:'Abrir menu de navegação'}).click();await page.locator('header nav').getByRole('button',{name,exact:true}).click()};
    await navigate('Monte seu PC');
    const cost=async()=>money(await page.getByTestId('pc-total-price').innerText());
    const power=async()=>Number((await page.getByTestId('pc-power-draw').innerText()).match(/\d+/)[0]);
    const baseline=await cost(),initialPower=await power();
    const gpu=page.getByTestId('pc-item-gpu').first();const gpuPrice=money(await gpu.locator('.font-extrabold').first().innerText());
    await gpu.getByRole('button',{name:/Adicionar outro/}).click();await expect(page.getByTestId('pc-item-gpu')).toHaveCount(2);expect(await cost()).toBe(baseline+gpuPrice);expect(await power()).toBe(initialPower+115);
    await page.getByTestId('pc-item-ram').first().getByRole('button',{name:/Adicionar outro/}).click();await expect(page.getByTestId('pc-item-ram')).toHaveCount(2);await expect(page.getByText('Slots de memória insuficientes',{exact:true})).toBeVisible();
    await page.getByTestId('pc-item-ram').nth(1).getByRole('button',{name:'Remover',exact:true}).click();await expect(page.getByTestId('pc-item-ram')).toHaveCount(1);await expect(page.getByText('Slots de memória insuficientes',{exact:true})).toHaveCount(0);
    await page.getByTestId('pc-item-storage').first().getByRole('button',{name:'Adicionar item em Armazenamento (SSD)'}).click();await page.getByRole('dialog').getByRole('button',{name:/Samsung 990 Pro/}).click();await expect(page.getByTestId('pc-item-storage')).toHaveCount(2);
    const beforeMonitorCost=await cost(),beforeMonitorPower=await power();await page.getByTestId('pc-item-monitor').getByRole('button',{name:'+ Escolher',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:/Dell UltraSharp/}).click();const monitor=page.getByTestId('pc-item-monitor').first();const monitorPrice=money(await monitor.locator('.font-extrabold').first().innerText());await monitor.getByRole('button',{name:/Adicionar outro/}).click();await expect(page.getByTestId('pc-item-monitor')).toHaveCount(2);expect(await cost()).toBe(beforeMonitorCost+2*monitorPrice);expect(await power()).toBe(beforeMonitorPower);
    await page.getByRole('button',{name:'Copiar Configuração Completa'}).click();const copied=await page.evaluate(()=>navigator.clipboard.readText());expect(copied).toContain('2× NVIDIA GeForce RTX 4060');expect(copied).toContain('2× Monitor Dell UltraSharp');expect(copied).toContain('Samsung 990 Pro');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);await page.screenshot({path:`artifacts/builder-multiple-${width}-${dark?'dark':'light'}.png`});const builderAudit=await new AxeBuilder({page}).withRules(['color-contrast']).analyze();
    await page.getByRole('button',{name:/Econômico/}).click();await expect(page.getByTestId('pc-item-gpu')).toHaveCount(1);await expect(page.getByTestId('pc-item-storage')).toHaveCount(1);await expect(page.getByTestId('pc-item-monitor')).toContainText('Slot vazio');
    await page.locator('main').getByRole('button',{name:'Limpar',exact:true}).click();for(const type of ['ram','gpu','storage','monitor'])await expect(page.getByTestId('pc-item-'+type)).toContainText('Slot vazio');
    await navigate('Recomendações');const filters=page.getByTestId('recommendation-filters'),results=page.getByTestId('recommendation-results');
    await filters.getByRole('button',{name:'Notebooks',exact:true}).click();await expect(results.getByTestId('recommendation-card')).toHaveCount(2);expect(await results.getByTestId('recommendation-card').evaluateAll(cards=>cards.every(c=>c.dataset.category==='notebooks'&&Number(c.dataset.price)<=5000))).toBe(true);
    const budget=filters.getByRole('slider',{name:'Orçamento máximo das recomendações'});await budget.focus();await budget.press('Home');await expect(results.getByTestId('recommendation-card')).toHaveCount(0);await expect(results).toContainText('Nenhum produto atendeu');
    await budget.press('End');await filters.getByRole('button',{name:'Eletrodomésticos',exact:true}).click();await expect(results.getByTestId('recommendation-card')).toHaveCount(2);await filters.getByRole('checkbox',{name:'Desconsiderar produtos com alerta de recall ativo'}).uncheck();await expect(results.getByTestId('recommendation-card')).toHaveCount(3);await filters.getByRole('checkbox',{name:'Desconsiderar produtos com alerta de recall ativo'}).check();await expect(results.getByTestId('recommendation-card')).toHaveCount(2);
    await filters.getByRole('button',{name:'Smartphones',exact:true}).click();await filters.getByRole('checkbox',{name:'Exigir certificação ambiental ou energética'}).check();await expect(results.getByTestId('recommendation-card')).toHaveCount(2);await expect(results).toContainText('Apple iPhone 15');await expect(results).not.toContainText('Xiaomi 14');await filters.getByRole('combobox',{name:'Finalidade principal'}).selectOption('jogos');await expect(results).toContainText('Perfil de jogos');
    await filters.getByRole('button',{name:'Restaurar',exact:true}).click();await expect(budget).toHaveValue('5000');await expect(filters.getByRole('button',{name:'Todas as Categorias',exact:true})).toHaveAttribute('aria-pressed','true');await expect(filters.getByRole('checkbox',{name:'Exigir certificação ambiental ou energética'})).not.toBeChecked();
    await page.waitForTimeout(250);expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);await page.screenshot({path:`artifacts/recommendations-filtered-${width}-${dark?'dark':'light'}.png`});const recommendationAudit=await new AxeBuilder({page}).withRules(['color-contrast']).analyze();reports.push({width,dark,errors,builder:builderAudit.violations,recommendations:recommendationAudit.violations});
    await context.close();
  }
  await writeFile('artifacts/builder-recommendation-report.json',JSON.stringify(reports,null,2));const failed=reports.filter(r=>r.errors.length||r.builder.length||r.recommendations.length);console.log(JSON.stringify({states:reports.length,failures:failed},null,2));if(failed.length)process.exitCode=1;
}finally{await browser.close()}
