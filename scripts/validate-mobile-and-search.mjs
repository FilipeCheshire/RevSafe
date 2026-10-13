import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { applyHostingHeaders } from './hosting-test-context.mjs';
import {writeFile} from 'node:fs/promises';
const browser = await chromium.launch();
const reports=[];
try {
  for(const width of [320,390,768,1440]) {
    const context=await browser.newContext({viewport:{width,height:900}});await applyHostingHeaders(context);const page=await context.newPage();
    const errors=[];page.on('pageerror', e=>errors.push(e.message));
    await page.goto('http://localhost:3000');
    const navigate=async tab=>{if(width<1280)await page.getByRole('button',{name:'Abrir menu de navegação'}).click();await page.locator('header nav').getByRole('button',{name:new RegExp('^'+tab+'(?:\\s*[0-9]+)?$')}).click()};
    if(width<1280){const xs=await Promise.all(['Abrir menu de navegação','RevSafe — início','Alternar tema claro e escuro','Entrar'].map(async name=>(await page.locator('header').getByRole('button',{name,exact:true}).boundingBox()).x));expect(xs).toEqual([...xs].sort((a,b)=>a-b));}
    for(const [query,expected] of [['notebook',3],['  NOTEBOOKS  ',3],['iPhone 15',1],['Iphone 18',0],['iphone18',0],['notebook Dell',1]]) {
      await navigate('Início');await page.getByRole('searchbox',{name:'Pesquisar produtos'}).fill(query);await page.getByRole('button',{name:'Buscar',exact:true}).click();await expect(page.locator('main').getByRole('button',{name:'Ficha Técnica',exact:true})).toHaveCount(expected);
    }
    await navigate('Início');
    for(let n=0;n<4;n++)await page.getByRole('button',{name:'Comparar',exact:true}).first().click();
    if(width<1024){const summary=page.locator('details').filter({hasText:'4 de 4 produtos selecionados'}).locator('summary');await summary.click();expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);}
    await page.getByRole('button',{name:'Comparar Lado a Lado'}).click();
    for(const dark of [false,true]){
      if(dark)await page.getByRole('button',{name:'Alternar tema claro e escuro'}).click();await page.waitForTimeout(350);
      if(width<1024){await expect(page.getByTestId('mobile-comparison')).toBeVisible();await expect(page.locator('main table')).toBeHidden();await expect(page.getByTestId('mobile-comparison').getByRole('region',{name:'Peso',exact:true})).toBeVisible();await expect(page.getByTestId('mobile-comparison').locator('article')).toHaveCount(4);}
      else await expect(page.locator('main table')).toBeVisible();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
      const audit=await new AxeBuilder({page}).withRules(['color-contrast']).analyze();reports.push({width,dark,violations:audit.violations,errors});
      await page.screenshot({path:`artifacts/comparison-${width}-${dark?'dark':'light'}.png`});
    }
    if(width<1024){await page.getByRole('button',{name:'Remover Samsung Galaxy S24 Ultra da comparação'}).click();await expect(page.getByTestId('mobile-comparison').locator('article')).toHaveCount(3);}
    await context.close();
  }
  await writeFile('artifacts/mobile-and-search-report.json',JSON.stringify(reports,null,2));
  console.log(JSON.stringify({states:reports.length,failures:reports.filter(r=>r.errors.length||r.violations.length).map(r=>({width:r.width,dark:r.dark,errors:r.errors,violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))}))}))},null,2));
  if(reports.some(r=>r.errors.length||r.violations.length))process.exitCode=1;
}finally{await browser.close()}
