import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const browser=await chromium.launch();const results=[];
try {
 for(const width of [320,768,1440]) {
  const context=await browser.newContext({viewport:{width,height:900}});
  const page=await context.newPage();
  await page.goto('http://localhost:3000');
  await page.locator('#login-email').fill('demo@example.com');await page.locator('#login-password').fill('demo');await page.getByRole('button',{name:'Entrar',exact:true}).click();
  const navigate=async name=>{if(width<1280)await page.getByRole('button',{name:'Abrir menu de navegação'}).click();await page.locator('header nav').getByRole('button',{name,exact:true}).click();};
  const audit=async(label,dark)=>{
   await page.waitForTimeout(250);
   const violations=(await new AxeBuilder({page}).withRules(['color-contrast']).analyze()).violations.flatMap(v=>v.nodes.map(n=>({html:n.html,summary:n.failureSummary})));
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
   results.push({width,dark,label,overflow,violations});
  };
  for(const dark of [false,true]){
   if(dark)await page.getByRole('button',{name:'Alternar tema claro e escuro'}).click();
   for(const name of ['Início','Catálogo','Comparador','Recomendações','Monte seu PC','Chatbot']){await navigate(name);await audit(name,dark);
    if(name==='Início') {await page.getByRole('button',{name:'Ficha Técnica',exact:true}).first().click();await audit('product-modal',dark);await page.getByRole('button',{name:'Fechar janela',exact:true}).click();}
    if(name==='Monte seu PC'){await page.getByTestId('pc-item-cpu').getByRole('button',{name:'Trocar',exact:true}).click();await audit('component-picker',dark);await page.getByRole('button',{name:'Fechar seleção'}).click();}
   }
  }
  await context.close();
 }
} finally {await browser.close();await mkdir('artifacts',{recursive:true});await writeFile('artifacts/theme-responsive-report.json',JSON.stringify(results,null,2));console.log(JSON.stringify({states:results.length,failures:results.filter(r=>r.overflow||r.violations.length)},null,2));}
if(results.some(r=>r.overflow||r.violations.length))process.exitCode=1;

