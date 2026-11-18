import { ArrowUpRight, Bell, ShieldCheck, X } from 'lucide-react';
import { Product } from '../../types';
import { useDialog } from './useDialog';

interface Props {
  open: boolean;
  products: Product[];
  onClose: () => void;
  onOpenReport: (product: Product) => void;
}

export function SafetyNotifications({ open, products, onClose, onOpenReport }: Props) {
  const ref = useDialog(open, onClose);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6" onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="alerts-title" className="notification-dialog w-full max-w-2xl max-h-[90dvh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-950 shadow-2xl">
        <div className="p-5 sm:p-7 bg-blue-50 dark:bg-slate-900 flex items-start gap-4">
          <span className="rounded-2xl p-3 bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300"><Bell className="w-6 h-6" /></span>
          <div className="flex-1 min-w-0"><p className="text-xs uppercase tracking-widest font-semibold text-blue-700 dark:text-blue-300">Segurança do consumidor</p><h2 id="alerts-title" className="mt-1 text-xl sm:text-2xl font-bold">Central de alertas</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{products.length} avisos para consultar antes de escolher.</p></div>
          <button onClick={onClose} aria-label="Fechar alertas" className="p-2 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 sm:p-6 space-y-4">
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 flex gap-2"><ShieldCheck className="w-4 h-4 shrink-0" />Dados demonstrativos. Estes avisos simulados não representam recalls oficiais.</p>
          {products.map(product => <article key={product.id} className="rounded-2xl p-4 sm:p-5 bg-amber-50/70 dark:bg-amber-950/20">
            <div className="flex items-start gap-3"><img src={product.image} alt="" className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0" /><div className="min-w-0"><span className="text-[10px] uppercase tracking-wider font-bold text-amber-800 dark:text-amber-300">Alerta ativo · simulado</span><h3 className="mt-1 text-sm sm:text-base font-bold leading-snug">{product.name}</h3></div></div>
            <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{product.safetyAlert.description}</p>
            <button onClick={() => onOpenReport(product)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white py-2.5 px-4 text-sm font-semibold">Ver relatório<ArrowUpRight className="w-4 h-4" /></button>
          </article>)}
        </div>
      </div>
    </div>
  );
}
