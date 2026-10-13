import type { PCBuildState, PCComponent, PCPartType } from '../types';

export const multiplePartTypes = ['ram', 'gpu', 'storage', 'monitor'] as const;
export type MultiplePartType = typeof multiplePartTypes[number];
export function allowsMultiple(type: PCPartType): type is MultiplePartType {
  return (multiplePartTypes as readonly string[]).includes(type);
}
export function componentsFor(build: PCBuildState, type: PCPartType): PCComponent[] {
  if (allowsMultiple(type)) return build[type];
  const item = build[type]; return item ? [item] : [];
}
export function allBuildComponents(build: PCBuildState): PCComponent[] {
  return [build.cpu, build.motherboard, ...build.ram, ...build.gpu, ...build.storage, build.psu, build.case, ...build.monitor].filter((c): c is PCComponent => !!c);
}
export function calculateBuildCost(build: PCBuildState): number {
  return allBuildComponents(build).reduce((total, c) => total + c.price, 0);
}
export function calculateLowestBuildCost(build: PCBuildState): number {
  return allBuildComponents(build).reduce((total, c) => {
    const quotes = c.priceQuotes?.filter(q => q.available).map(q => q.price) || [];
    return total + (quotes.length ? Math.min(...quotes) : c.price);
  }, 0);
}
export function totalRamModules(build: PCBuildState): number {
  return build.ram.reduce((total, c) => total + (c.ramModules || 1), 0);
}
export function partsListText(build: PCBuildState): string[] {
  const groups = new Map<string, { component: PCComponent; quantity: number }>();
  for (const component of allBuildComponents(build)) {
    const previous = groups.get(component.id);
    groups.set(component.id, { component, quantity: (previous?.quantity || 0) + 1 });
  }
  return [...groups.values()].map(({ component: c, quantity }) => `• ${c.typeLabel}: ${quantity}× ${c.name} (R$ ${(c.price * quantity).toLocaleString('pt-BR')})`);
}
