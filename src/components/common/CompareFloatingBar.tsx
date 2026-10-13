import React from 'react';
import { ArrowRight, X, Trash2, Scale } from 'lucide-react';
import { Product } from '../../types';

interface CompareFloatingBarProps {
  products: Product[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onOpenCompare: () => void;
}

export const CompareFloatingBar: React.FC<CompareFloatingBarProps> = ({
  products,
  onRemove,
  onClear,
  onOpenCompare,
}) => {
  if (products.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-950/95 dark:bg-black/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-800 p-3 sm:p-4 flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="hidden lg:flex items-center gap-3 w-full lg:w-auto min-w-0 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-2 pr-2 border-r border-slate-800 shrink-0">
            <div className="p-2 rounded-xl bg-brand/20 text-blue-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">Comparador</div>
              <div className="text-xs text-slate-300 font-medium">
                {products.length} de 4 selecionados
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2 bg-slate-900 rounded-xl p-1.5 pr-2.5 border border-slate-800 group"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-8 h-8 rounded-lg object-cover bg-slate-800"
                />
                <div className="max-w-[120px] truncate text-xs font-medium text-slate-200">
                  {p.name}
                </div>
                <button
                  onClick={() => onRemove(p.id)}
                  className="text-slate-400 hover:text-rose-400 p-0.5 rounded transition-colors"
                  title="Remover da comparação"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {Array.from({ length: 4 - products.length }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="w-8 h-8 rounded-xl border border-dashed border-slate-800 flex items-center justify-center text-xs text-slate-600 shrink-0"
                title="Espaço disponível"
              >
                +
              </div>
            ))}
          </div>
        </div>

        <details className="lg:hidden w-full min-w-0">
          <summary className="cursor-pointer text-sm font-semibold text-slate-100">{products.length} de 4 produtos selecionados</summary>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 max-h-48 overflow-y-auto">
            {products.map(p => (
              <div key={p.id} className="min-w-0 flex items-center gap-2 rounded-lg bg-slate-900 p-2">
                <img src={p.image} alt="" className="w-7 h-7 rounded object-cover shrink-0" />
                <span className="min-w-0 text-xs text-slate-200 break-words flex-1">{p.name}</span>
                <button onClick={() => onRemove(p.id)} aria-label={`Remover ${p.name} da seleção`} className="shrink-0 p-1 text-slate-300"><X className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </details>

        <div className="flex items-center gap-2 w-full lg:w-auto justify-end shrink-0">
          <button
            onClick={onClear}
            aria-label="Limpar comparação"
            className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Limpar</span>
          </button>

          <button
            onClick={onOpenCompare}
            disabled={products.length < 2}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md ${
              products.length >= 2
                ? 'bg-brand-action hover:bg-brand-action-hover text-white cursor-pointer shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 border border-slate-800 cursor-not-allowed'
            }`}
          >
            <span>{products.length < 2 ? 'Selecione ao menos 2' : 'Comparar Lado a Lado'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
