import React, { useState } from 'react';
import {
  X,
  Plus,
  Scale,
  Award,
  ShieldCheck,
  Leaf,
  Coins,
  Check,
  AlertCircle,
  ArrowRight,
  Share2
} from 'lucide-react';
import { Product } from '../../types';
import { MobileComparison } from './MobileComparison';
import { MOCK_PRODUCTS } from '../../data/mockProducts';

interface CompareViewProps {
  comparedProducts: Product[];
  onRemoveProduct: (productId: string) => void;
  onAddProduct: (product: Product) => void;
  onClearAll: () => void;
  onOpenProductDetail: (product: Product) => void;
  onNavigateToCatalog: () => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  comparedProducts,
  onRemoveProduct,
  onAddProduct,
  onClearAll,
  onOpenProductDetail,
  onNavigateToCatalog,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const availableToAdd = MOCK_PRODUCTS.filter(
    (p) => !comparedProducts.some((cp) => cp.id === p.id)
  );

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  if (comparedProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 shadow-sm">
          <Scale className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Nenhum produto selecionado para comparação
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto text-sm mt-2 leading-relaxed">
          Selecione de 2 a 4 produtos no catálogo para comparar especificações, notas de segurança e custo-benefício lado a lado.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onNavigateToCatalog}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-action hover:bg-brand-action-hover text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Ver Catálogo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              const p1 = MOCK_PRODUCTS.find((p) => p.id === 'prod-sp-01');
              const p2 = MOCK_PRODUCTS.find((p) => p.id === 'prod-sp-02');
              if (p1) onAddProduct(p1);
              if (p2) onAddProduct(p2);
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-200 font-medium text-sm transition-all cursor-pointer"
          >
            Comparar Galaxy S24 Ultra vs iPhone 15
          </button>
        </div>
      </div>
    );
  }

  const lowestPrice = Math.min(...comparedProducts.map((p) => p.price));
  const highestOverall = Math.max(...comparedProducts.map((p) => p.scores.overall));
  const highestQuality = Math.max(...comparedProducts.map((p) => p.scores.quality));
  const highestSafety = Math.max(...comparedProducts.map((p) => p.scores.safety));
  const highestSust = Math.max(...comparedProducts.map((p) => p.scores.sustainability));
  const highestCostBenefit = Math.max(...comparedProducts.map((p) => p.scores.costBenefit));

  const allSpecKeys = Array.from(
    new Set(comparedProducts.flatMap((p) => Object.keys(p.specs)))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header com ações */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Comparador Lado a Lado
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Comparação detalhada de até 4 produtos em atributos equivalentes (RF-003 / RNE-003).
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          <button
            onClick={handleCopyLink}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedNotification ? 'Copiado!' : 'Compartilhar'}</span>
          </button>

          {comparedProducts.length < 4 && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-brand-action hover:bg-brand-action-hover text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar ({comparedProducts.length}/4)</span>
            </button>
          )}

          <button
            onClick={onClearAll}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs font-semibold transition-colors cursor-pointer"
          >
            Limpar
          </button>
        </div>
      </div>

      <MobileComparison products={comparedProducts} onRemove={onRemoveProduct} onOpenDetails={onOpenProductDetail} />

      {/* Tabela Comparativa */}
      <div className="hidden lg:block overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950">
        <table className="w-full border-collapse">
          {/* Header de Produtos */}
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900">
              <th className="p-4 sm:p-6 text-left w-48 sm:w-64 min-w-[180px] align-top">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Critério de Comparação
                </span>
              </th>

              {comparedProducts.map((p) => (
                <th
                  key={p.id}
                  className="p-4 sm:p-6 text-left min-w-[240px] max-w-[280px] align-top border-l border-slate-200 dark:border-slate-800 relative group"
                >
                  <button
                    onClick={() => onRemoveProduct(p.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Remover produto da comparação"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3 border border-slate-200 dark:border-slate-700">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {p.brand}
                  </span>
                  <h3
                    onClick={() => onOpenProductDetail(p)}
                    className="font-bold text-slate-900 dark:text-white text-base hover:text-blue-600 cursor-pointer line-clamp-1 mt-0.5"
                    title={p.name}
                  >
                    {p.name}
                  </h3>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                      R$ {p.price.toLocaleString('pt-BR')}
                    </span>
                    {p.price === lowestPrice && comparedProducts.length > 1 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                        Menor Preço
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onOpenProductDetail(p)}
                    className="mt-3 w-full py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors text-center cursor-pointer"
                  >
                    Ficha Técnica
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* LINHA: NOTA GLOBAL */}
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-blue-50/30 dark:bg-blue-950/20">
              <td className="p-4 sm:p-5 font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                <div className="flex items-center gap-2">
                  <span>Nota Global RevSafe</span>
                </div>
              </td>
              {comparedProducts.map((p) => {
                const isBest = p.scores.overall === highestOverall && comparedProducts.length > 1;
                return (
                  <td key={p.id} className="p-4 sm:p-5 border-l border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-slate-900 dark:text-white">
                        {p.scores.overall.toFixed(1)}
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-normal">/10</span>
                      </span>
                      {isBest && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-action text-white uppercase tracking-wider">
                          Líder
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* LINHA: QUALIDADE */}
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <td className="p-4 sm:p-5 font-semibold text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>Qualidade & Durabilidade</span>
                </div>
              </td>
              {comparedProducts.map((p) => (
                <td key={p.id} className="p-4 sm:p-5 border-l border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-blue-600 dark:text-blue-400">{p.scores.quality.toFixed(1)}/10</span>
                    {p.scores.quality === highestQuality && comparedProducts.length > 1 && (
                      <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded">Maior</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {p.pillarNotes.quality}
                  </p>
                </td>
              ))}
            </tr>

            {/* LINHA: SEGURANÇA */}
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <td className="p-4 sm:p-5 font-semibold text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-700" />
                  <span>Segurança & Certificações</span>
                </div>
              </td>
              {comparedProducts.map((p) => (
                <td key={p.id} className="p-4 sm:p-5 border-l border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-sky-700 dark:text-sky-400">{p.scores.safety.toFixed(1)}/10</span>
                    {p.scores.safety === highestSafety && comparedProducts.length > 1 && (
                      <span className="text-[10px] font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950 px-1.5 py-0.5 rounded">Mais Seguro</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {p.pillarNotes.safety}
                  </p>
                  {p.safetyAlert.hasAlert && (
                    <div className="mt-2 text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2 rounded border border-amber-200 dark:border-amber-900">
                      ⚠️ {p.safetyAlert.title}
                    </div>
                  )}
                </td>
              ))}
            </tr>

            {/* LINHA: SUSTENTABILIDADE */}
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <td className="p-4 sm:p-5 font-semibold text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span>Sustentabilidade & Eficiência</span>
                </div>
              </td>
              {comparedProducts.map((p) => (
                <td key={p.id} className="p-4 sm:p-5 border-l border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{p.scores.sustainability.toFixed(1)}/10</span>
                    {p.scores.sustainability === highestSust && comparedProducts.length > 1 && (
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">Mais Ecológico</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {p.pillarNotes.sustainability}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                    <span>Reparabilidade: <b>{p.reparabilityIndex}/10</b></span>
                    <span>Classe: <b>{p.energyClass || 'Sem informação'}</b></span>
                  </div>
                </td>
              ))}
            </tr>

            {/* LINHA: CUSTO-BENEFÍCIO */}
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <td className="p-4 sm:p-5 font-semibold text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-indigo-600" />
                  <span>Custo-Benefício Real</span>
                </div>
              </td>
              {comparedProducts.map((p) => (
                <td key={p.id} className="p-4 sm:p-5 border-l border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-indigo-600 dark:text-indigo-400">{p.scores.costBenefit.toFixed(1)}/10</span>
                    {p.scores.costBenefit === highestCostBenefit && comparedProducts.length > 1 && (
                      <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded">Melhor Retorno</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {p.pillarNotes.costBenefit}
                  </p>
                </td>
              ))}
            </tr>

            {/* LINHA: PRÓS & CONTRAS */}
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <td className="p-4 sm:p-5 font-bold text-xs text-slate-800 dark:text-slate-200 align-top">
                Prós & Contras
              </td>
              {comparedProducts.map((p) => (
                <td key={p.id} className="p-4 sm:p-5 border-l border-slate-200 dark:border-slate-800 align-top text-xs space-y-3">
                  <div>
                    <div className="font-bold text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Vantagens</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                      {p.pros.slice(0, 3).map((pro, idx) => (
                        <li key={idx}>{pro}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Pontos de Atenção</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                      {p.cons.slice(0, 2).map((con, idx) => (
                        <li key={idx}>{con}</li>
                      ))}
                    </ul>
                  </div>
                </td>
              ))}
            </tr>

            {/* LINHAS ESPECIFICAÇÕES TÉCNICAS */}
            {allSpecKeys.map((key) => (
              <tr key={key} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-900/30 transition-colors">
                <td className="p-3.5 sm:p-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {key}
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-3.5 sm:p-4 text-xs text-slate-800 dark:text-slate-200 border-l border-slate-200 dark:border-slate-800">
                    {p.specs[key] || <span className="text-slate-600 dark:text-slate-400 italic">Sem informação</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para Adicionar Produto */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-950 rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Adicionar Produto para Comparar
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto py-4 space-y-2 flex-1">
              {availableToAdd.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => {
                    onAddProduct(prod);
                    setIsAddModalOpen(false);
                  }}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 flex items-center justify-between gap-4 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <div className="text-[10px] font-bold text-blue-600 uppercase">
                        {prod.brand} • {prod.categoryLabel}
                      </div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">
                        {prod.name}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        Nota: {prod.scores.overall.toFixed(1)}/10
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                      R$ {prod.price.toLocaleString('pt-BR')}
                    </div>
                    <span className="text-xs font-semibold text-blue-600">
                      + Adicionar
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
