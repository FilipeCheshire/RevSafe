import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import type { Product } from '../../types';

interface MobileComparisonProps {
  products: Product[];
  onRemove: (id: string) => void;
  onOpenDetails: (product: Product) => void;
}

export function MobileComparison({ products, onRemove, onOpenDetails }: MobileComparisonProps) {
  const specificationKeys = [...new Set(products.flatMap(p => Object.keys(p.specs)))];
  const columns = products.length === 1 ? 'grid-cols-1' : 'grid-cols-2';
  const section = (label: string, value: (product: Product) => ReactNode) => (
    <section key={label} aria-label={label} className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950">
      <h3 className="bg-slate-100 dark:bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white">{label}</h3>
      <dl className={`grid ${columns} gap-px bg-slate-200 dark:bg-slate-800`}>
        {products.map(p => (
          <div key={p.id} className="min-w-0 p-3 bg-white dark:bg-slate-950">
            <dt className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 break-words">{p.name}</dt>
            <dd className="text-sm text-slate-900 dark:text-slate-100 break-words">{value(p)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
  const scores = [
    ['overall', 'Nota global'], ['quality', 'Qualidade e durabilidade'],
    ['safety', 'Segurança e certificações'], ['sustainability', 'Sustentabilidade e eficiência'],
    ['costBenefit', 'Custo-benefício'],
  ] as const;

  return (
    <div data-testid="mobile-comparison" className="lg:hidden space-y-4">
      <p className="text-xs text-slate-600 dark:text-slate-400">Compare por critério abaixo. Todos os produtos selecionados estão visíveis, sem rolagem lateral.</p>
      <div className={`grid ${columns} gap-3`}>
        {products.map(p => (
          <article key={p.id} className="relative min-w-0 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
            <button onClick={() => onRemove(p.id)} aria-label={`Remover ${p.name} da comparação`} className="absolute top-2 right-2 rounded-lg bg-white dark:bg-slate-800 p-2 text-slate-700 dark:text-slate-200"><X className="w-4 h-4" /></button>
            <img src={p.image} alt={p.name} className="w-full aspect-[4/3] rounded-lg object-cover mb-3" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white break-words">{p.name}</h2>
            <button onClick={() => onOpenDetails(p)} className="mt-3 w-full rounded-lg bg-slate-100 dark:bg-slate-800 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100">Ficha Técnica</button>
          </article>
        ))}
      </div>
      {section('Preço', p => <><strong>R$ {p.price.toLocaleString('pt-BR')}</strong>{products.length > 1 && p.price === Math.min(...products.map(v => v.price)) && <span className="block mt-1 text-xs font-semibold text-blue-700 dark:text-blue-300">Menor preço</span>}</>)}
      {scores.map(([key, label]) => section(label, p => (
        <>
          <strong>{p.scores[key].toFixed(1)}/10</strong>
          {products.length > 1 && p.scores[key] === Math.max(...products.map(v => v.scores[key])) && <span className="block mt-1 text-xs font-semibold text-blue-700 dark:text-blue-300">Melhor nota</span>}
          {key !== 'overall' && <details className="mt-2 text-xs text-slate-700 dark:text-slate-300"><summary className="cursor-pointer font-medium">Ver análise</summary><p className="mt-2 leading-relaxed">{p.pillarNotes[key]}</p></details>}
          {key === 'safety' && p.safetyAlert.hasAlert && <p className="mt-2 text-xs text-amber-800 dark:text-amber-300">Alerta: {p.safetyAlert.title}</p>}
        </>
      )))}
      {section('Reparabilidade', p => `${p.reparabilityIndex}/10`)}
      {section('Classe energética', p => p.energyClass || 'Sem informação')}
      {section('Certificações', p => p.certifications.length ? p.certifications.join(' · ') : 'Sem informação')}
      {section('Vantagens', p => <ul className="list-disc pl-4 text-xs space-y-2">{p.pros.map(pro => <li key={pro}>{pro}</li>)}</ul>)}
      {section('Pontos de atenção', p => <ul className="list-disc pl-4 text-xs space-y-2">{p.cons.map(con => <li key={con}>{con}</li>)}</ul>)}
      {specificationKeys.map(key => section(key, p => {
        if (p.specs[key]) return p.specs[key];
        const applies = products.some(v => v.category === p.category && key in v.specs);
        return <span className="text-slate-600 dark:text-slate-400 italic">{applies ? 'Sem informação' : 'Não se aplica a esta categoria'}</span>;
      }))}
    </div>
  );
}
