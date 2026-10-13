import type { Category, Product } from '../types';

export function normalizeSearch(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/([a-z])(\d)/g, '$1 $2').replace(/(\d)([a-z])/g, '$1 $2')
    .replace(/[^a-z0-9]+/g, ' ').trim();
}

const categories: Record<string, Category> = {
  notebook: 'notebooks', notebooks: 'notebooks', laptop: 'notebooks', laptops: 'notebooks',
  smartphone: 'smartphones', smartphones: 'smartphones', celular: 'smartphones', celulares: 'smartphones',
  eletrodomestico: 'eletrodomesticos', eletrodomesticos: 'eletrodomesticos',
  audio: 'audio', fone: 'audio', fones: 'audio', headphone: 'audio', headphones: 'audio',
  monitor: 'monitores', monitores: 'monitores', hardware: 'hardware',
};

export function matchesProductSearch(product: Product, input: string): boolean {
  const query = normalizeSearch(input);
  if (!query) return true;
  const tokens = query.split(' ');
  const core = normalizeSearch(`${product.name} ${product.brand} ${product.categoryLabel}`).split(' ');
  const specifications = normalizeSearch(Object.values(product.specs).join(' ')).split(' ');
  const modelSearch = tokens.some(t => ['iphone', 'galaxy', 'xiaomi', 'motorola', 'macbook', 'thinkpad', 'inspiron', 'odyssey'].includes(t));
  return tokens.every(token => {
    const category = categories[token];
    if (category) return product.category === category;
    const words = modelSearch ? core : [...core, ...specifications];
    return words.some(word => /^\d+$/.test(token) ? word === token : word.startsWith(token));
  });
}
