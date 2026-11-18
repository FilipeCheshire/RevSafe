import React, { useState, useMemo, useRef } from 'react';
import {
  Sliders,
  Award,
  ShieldCheck,
  Leaf,
  Coins,
  RotateCcw,
  Scale,
  CheckCircle2
} from 'lucide-react';
import { Category, Product, RecommendationPreferences } from '../../types';
import { getRecommendations } from '../../services/recommendationEngine';

interface RecommendationsViewProps {
  onOpenProductDetail: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  comparedIds: string[];
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  onOpenProductDetail,
  onToggleCompare,
  comparedIds,
}) => {
  const [preferences, setPreferences] = useState<RecommendationPreferences>({
    category: 'all',
    budgetMax: 5000,
    purpose: 'produtividade',
    weights: {
      quality: 4,
      safety: 5,
      sustainability: 4,
      costBenefit: 5,
    },
    requireEcoCert: false,
    requireNoAlerts: true,
  });

  const resultsRef = useRef<HTMLDivElement>(null);
  const recommendations = useMemo(() => getRecommendations(preferences), [preferences]);
  const handleRunRecommendation = () => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleReset = () => {
    const defaultPrefs: RecommendationPreferences = {
      category: 'all',
      budgetMax: 5000,
      purpose: 'produtividade',
      weights: {
        quality: 4,
        safety: 5,
        sustainability: 4,
        costBenefit: 5,
      },
      requireEcoCert: false,
      requireNoAlerts: true,
    };
    setPreferences(defaultPrefs);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Recomendações Personalizadas
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
          Informe seu orçamento, finalidade de uso e preferências para receber sugestões fundamentadas com critérios claros.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Formulário de Preferências (Coluna Esquerda) */}
        <div data-testid="recommendation-filters" className="min-w-0 lg:col-span-5 bg-white dark:bg-slate-950 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
              <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-300" />
              <span>Critérios e Preferências</span>
            </div>
            <button
              onClick={handleReset}
              className="shrink-0 whitespace-nowrap text-xs text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restaurar</span>
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400">Os resultados são atualizados ao alterar os critérios. Categoria, orçamento e restrições são sempre respeitados; finalidade e pesos ajustam a ordem.</p>
          {/* 1. Categoria */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              1. Categoria
            </label>
            <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2">
              {[
                { id: 'all', label: 'Todas as Categorias' },
                { id: 'smartphones', label: 'Smartphones' },
                { id: 'notebooks', label: 'Notebooks' },
                { id: 'eletrodomesticos', label: 'Eletrodomésticos' },
                { id: 'audio', label: 'Áudio & Fones' },
                { id: 'monitores', label: 'Monitores' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={preferences.category === cat.id}
                  onClick={() => setPreferences({ ...preferences, category: cat.id as any })}
                  className={`py-2 px-3 rounded-lg text-xs font-medium text-left transition-shadow cursor-pointer ${
                    preferences.category === cat.id
                      ? 'bg-brand-action text-white font-semibold'
                      : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Orçamento Máximo */}
          <div>
            <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                2. Orçamento Máximo
              </label>
              <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                R$ {preferences.budgetMax.toLocaleString('pt-BR')}
              </span>
            </div>
            <input
              aria-label="Orçamento máximo das recomendações"
              type="range"
              min="300"
              max="12000"
              step="100"
              value={preferences.budgetMax}
              onChange={(e) =>
                setPreferences({ ...preferences, budgetMax: parseInt(e.target.value) })
              }
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400 font-medium mt-1">
              <span>R$ 300</span>
              <span>R$ 5.000</span>
              <span>R$ 12.000</span>
            </div>
          </div>

          {/* 3. Finalidade */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              3. Finalidade Principal
            </label>
            <select
              aria-label="Finalidade principal"
              value={preferences.purpose}
              onChange={(e) => setPreferences({ ...preferences, purpose: e.target.value })}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="produtividade">Trabalho, Produtividade & Estudos</option>
              <option value="jogos">Jogos & Desempenho Gráfico</option>
              <option value="diaadia">Uso Geral Doméstico & Familiar</option>
              <option value="longevidade">Durabilidade e Facilidade de Reparo</option>
            </select>
          </div>

          {/* 4. Importância dos 4 Pilares (Pesos 1 a 5) */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              4. Prioridades de Avaliação (1 a 5)
            </label>

            {/* Qualidade */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-semibold">
                  <Award className="w-3.5 h-3.5" /> Qualidade dos Materiais:
                </span>
                <span className="font-bold">{preferences.weights.quality}/5</span>
              </div>
              <input
                aria-label="Peso de qualidade"
                type="range"
                min="1"
                max="5"
                value={preferences.weights.quality}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    weights: { ...preferences.weights, quality: parseInt(e.target.value) },
                  })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Segurança */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Segurança & Certificações:
                </span>
                <span className="font-bold">{preferences.weights.safety}/5</span>
              </div>
              <input
                aria-label="Peso de segurança"
                type="range"
                min="1"
                max="5"
                value={preferences.weights.safety}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    weights: { ...preferences.weights, safety: parseInt(e.target.value) },
                  })
                }
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>

            {/* Sustentabilidade */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                  <Leaf className="w-3.5 h-3.5" /> Sustentabilidade:
                </span>
                <span className="font-bold">{preferences.weights.sustainability}/5</span>
              </div>
              <input
                aria-label="Peso de sustentabilidade"
                type="range"
                min="1"
                max="5"
                value={preferences.weights.sustainability}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    weights: { ...preferences.weights, sustainability: parseInt(e.target.value) },
                  })
                }
                className="w-full accent-slate-600 cursor-pointer"
              />
            </div>

            {/* Custo-Benefício */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400 font-semibold">
                  <Coins className="w-3.5 h-3.5" /> Custo-Benefício:
                </span>
                <span className="font-bold">{preferences.weights.costBenefit}/5</span>
              </div>
              <input
                aria-label="Peso de custo-benefício"
                type="range"
                min="1"
                max="5"
                value={preferences.weights.costBenefit}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    weights: { ...preferences.weights, costBenefit: parseInt(e.target.value) },
                  })
                }
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Restrições Estritas */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.requireNoAlerts}
                onChange={(e) =>
                  setPreferences({ ...preferences, requireNoAlerts: e.target.checked })
                }
                className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700"
              />
              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                Desconsiderar produtos com alerta de recall ativo
              </span>
            </label>
          </div>

          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={preferences.requireEcoCert} onChange={e => setPreferences({ ...preferences, requireEcoCert: e.target.checked })} className="mt-0.5 accent-blue-600" />
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">Exigir certificação ambiental ou energética</span>
          </label>

          <button
            type="button"
            onClick={handleRunRecommendation}
            className="w-full py-2.5 rounded-xl bg-brand-action hover:bg-brand-action-hover text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Ver Recomendações</span>
          </button>
        </div>

        {/* Resultados das Recomendações (Coluna Direita) */}
        <div ref={resultsRef} data-testid="recommendation-results" className="min-w-0 lg:col-span-7 space-y-4 scroll-mt-24">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Opções Recomendadas</span>
              <span aria-live="polite" className="text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2.5 py-0.5 rounded-full">
                {recommendations.length} encontrados
              </span>
            </h2>
          </div>

          {recommendations.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Nenhum produto atendeu aos critérios informados. Ajuste a categoria, o orçamento ou as restrições para visualizar opções.
              </p>
            </div>
          ) : (
            recommendations.map((rec, index) => {
              const prod = rec.product;
              const isCompared = comparedIds.includes(prod.id);

              return (
                <div
                  key={prod.id}
                  data-testid="recommendation-card"
                  data-category={prod.category}
                  data-price={prod.price}
                  className="bg-white dark:bg-slate-950 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4 relative overflow-hidden"
                >
                  {/* Top Match Bar */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-action text-white shadow-sm flex items-center gap-1.5">
                        <span>{rec.matchScore}% de Compatibilidade</span>
                      </span>
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                        {rec.tag}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      #{index + 1}
                    </div>
                  </div>

                  {/* Main Product Info */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 bg-slate-100"
                    />

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        {prod.brand} • {prod.categoryLabel}
                      </span>
                      <h3
                        onClick={() => onOpenProductDetail(prod)}
                        className="font-bold text-base sm:text-lg text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer line-clamp-1"
                      >
                        {prod.name}
                      </h3>
                      <div className="flex flex-wrap items-baseline gap-2 mt-1">
                        <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                          R$ {prod.price.toLocaleString('pt-BR')}
                        </span>
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                          Nota Geral: {prod.scores.overall.toFixed(1)}/10
                        </span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => onOpenProductDetail(prod)}
                        className="flex-1 sm:flex-none py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 text-center cursor-pointer transition-colors"
                      >
                        Ficha Técnica
                      </button>
                      <button
                        onClick={() => onToggleCompare(prod)}
                        className={`flex-1 sm:flex-none py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          isCompared
                            ? 'bg-brand-action text-white'
                            : 'border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500'
                        }`}
                      >
                        <Scale className="w-3.5 h-3.5" />
                        <span>{isCompared ? 'Comparando' : 'Comparar'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Justificativas do Algoritmo */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                    <div className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-300" />
                      <span>Critérios considerados na indicação:</span>
                    </div>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-400 pl-4 list-disc">
                      {rec.reasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>

                    {rec.tradeoffs.length > 0 && (
                      <div className="pt-1 text-amber-700 dark:text-amber-400 font-medium">
                        <span>Ponto de atenção:</span> {rec.tradeoffs.join(' ')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
