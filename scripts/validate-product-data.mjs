import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import ts from 'typescript';
const modules = new Map();
async function moduleUrl(path) {
  path = resolve(path);
  if(modules.has(path)) return modules.get(path);
  let js=ts.transpileModule(await readFile(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
  for(const match of [...js.matchAll(/from ['"](\.[^'"]+)['"]/g)]) {
    const url=await moduleUrl(resolve(dirname(path),match[1]+'.ts'));
    js=js.replace(match[0],`from '${url}'`);
  }
  const url='data:text/javascript;base64,'+Buffer.from(js).toString('base64');modules.set(path,url);return url;
}
const {MOCK_PRODUCTS:products}=await import(await moduleUrl('src/data/mockProducts.ts'));
const {MOCK_PC_COMPONENTS:components}=await import(await moduleUrl('src/data/mockPCComponents.ts'));
const {matchesProductSearch:matches}=await import(await moduleUrl('src/services/productSearch.ts'));
assert.equal(products.filter(p=>matches(p,'  NOTEBOOK  ')).length,3);
assert(products.filter(p=>matches(p,'notebook')).every(p=>p.category==='notebooks'));
assert.equal(products.filter(p=>matches(p,'iphone 18')).length,0);
const iphone=products.find(p=>p.id==='prod-sp-02');
const fixtures=['Apple iPhone 18','Apple iPhone 18 Pro','Apple iPhone 18 Pro Max','Apple iPhone 180','Apple iPhone 15'].map((name,n)=>({...iphone,id:'fixture-'+n,name,specs:{...iphone.specs,Outros:'18 anos de suporte'}}));
assert.equal(fixtures.filter(p=>matches(p,'iPhone18')).length,3);
assert.equal(fixtures.filter(p=>matches(p,'iphone 18 pro')).length,2);
assert.equal(fixtures.filter(p=>matches(p,'iphone 18 pro max')).length,1);
assert.equal(fixtures.filter(p=>matches(p,'iphone 19')).length,0);
for(const product of [...products,...components])for(const key of ['Peso','Altura','Largura','Profundidade / espessura','Peso com embalagem'])assert.equal(typeof product.specs[key],'string',`${product.name}: ${key}`);
assert.equal(iphone.specs.Peso,'171 g');assert.equal(iphone.specs.Altura,'147,6 mm');
assert([...products,...components].some(p=>Object.values(p.specs).some(v=>v.startsWith('Sem informação'))));
console.log(`Search category/model cases and physical-data coverage passed for ${products.length} products and ${components.length} PC components.`);
