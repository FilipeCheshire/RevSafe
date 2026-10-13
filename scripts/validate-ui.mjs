import { applyHostingHeaders } from './hosting-test-context.mjs';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({headless:true});
const results=[]; const errors=[];
for(const width of [320,390,768,1024,1440]) {
 const context=await browser.newContext({viewport:{width,height:900}});
 await applyHostingHeaders(context);
 const page=await context.newPage();
 page.on('pageerror', e=>errors.push(e.message));
 await page.goto('http://localhost:3000');
 await page.waitForTimeout(250);
 for(const dark of [false,true]) {
  if(dark) await page.getByRole('button',{name:'Alternar tema claro e escuro'}).click();
  for(const tab of ['Início','Catálogo','Comparador','Recomendações','Monte seu PC','Chatbot']) {
   if(width<1280) await page.getByRole('button',{name:'Abrir menu de navegação'}).click();
   await page.locator('header nav').getByRole('button',{name:new RegExp('^'+tab+'(?:\\s*[0-9]+)?$')}).click();
   await page.waitForTimeout(120);
   const overflow=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
   const audit=await new AxeBuilder({page}).withRules(['color-contrast']).analyze();
   results.push({width,dark,tab,overflow,contrast:audit.violations.flatMap(v=>v.nodes.map(n=>({target:n.target,summary:n.failureSummary,html:n.html})))});
   if(width===390||width===1440) await page.screenshot({path:`artifacts/${width}-${dark?'dark':'light'}-${tab}.png`});
  }
 }
 await context.close();
}
await writeFile('artifacts/ui-report.json',JSON.stringify({results,errors},null,2));
console.log(JSON.stringify({states:results.length,errors,overflow:results.filter(r=>r.overflow.scroll>r.width).map(r=>({width:r.width,tab:r.tab})),contrast:results.filter(r=>r.contrast.length).map(r=>({width:r.width,dark:r.dark,tab:r.tab,count:r.contrast.length}))},null,2));
await browser.close();
if(errors.length || results.some(r=>r.overflow.scroll>r.width || r.contrast.length)) process.exitCode=1;
