import React, { useState } from 'react';
import {
  X,
  Scale,
  Check,
  Heart,
  ExternalLink,
  ShieldCheck,
  Award,
  Leaf,
  Coins,
  MessageSquare,
  AlertCircle,
  Wrench,
  Zap,
  Building2,
  FileText,
  ShoppingCart
} from 'lucide-react';
import { Product } from '../../types';
import { PillarBadge } from '../common/PillarBadge';
import { SafetyAlertBanner } from '../common/SafetyAlertBanner';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isCompared: boolean;
  onToggleCompare: (product: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: (productId: string) => void;
  onAskChatbot?: (productName: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  isCompared,
  onToggleCompare,
  isFavorite,
  onToggleFavorite,
  onAskChatbot,
}) => {
  const [activeTab, setActiveTab] = useState<'pilares' | 'specs' | 'precos' | 'fontes'>('pilares');

  if (!isOpen || !product) return null;

  // Cotações de preço padrão simuladas
  const priceQuotes = product.priceQuotes || [
    { storeName: 'KaBuM!', price: product.price, available: true, isLowestPrice: true },
    { storeName: 'Amazon Brasil', price: Math.round(product.price * 1.04), available: true },
    { storeName: 'Mercado Livre Oficial', price: Math.round(product.price * 1.07), available: true },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div role="dialog" aria-modal="true" aria-label={product.name} className="relative w-full max-w-4xl bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-auto max-h-[92dvh] flex flex-col overflow-hidden">
        
        {/* Header Modal Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-md">
              {product.brand} • {product.categoryLabel}
            </span>
            {product.badge && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                {product.badge}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(product.id)}
              className={`p-2 rounded-lg transition-colors ${
                isFavorite
                  ? 'bg-rose-50 text-rose-500'
                  : 'text-slate-600 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Favoritar"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Fechar janela"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6 flex-1">
          {/* Hero Banner Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-5">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>Nota Global: {product.scores.overall.toFixed(1)}/10</span>
                </div>
              </div>

              {/* Price and Action Box */}
              <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Preço Médio Estimado</div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white my-1">
                  R$ {product.price.toLocaleString('pt-BR')}
                </div>
                {product.originalPrice && (
                  <div className="text-xs text-slate-600 dark:text-slate-400 line-through mb-3">
                    Preço de lançamento: R$ {product.originalPrice.toLocaleString('pt-BR')}
                  </div>
                )}

                <div className="flex flex-col gap-2 mt-3">
                  <button
                    onClick={() => onToggleCompare(product)}
                    className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isCompared
                        ? 'bg-brand-action text-white shadow-sm'
                        : 'border border-slate-300 dark:border-slate-700 hover:border-blue-600 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {isCompared ? <Check className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
                    <span>{isCompared ? 'Item no Comparador (Ativo)' : 'Adicionar ao Comparador'}</span>
                  </button>

                  {onAskChatbot && (
                    <button
                      onClick={() => {
                        onClose();
                        onAskChatbot(product.name);
                      }}
                      className="w-full py-2.5 px-4 rounded-lg font-semibold text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Consultar no Chatbot</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Information Column */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {product.name}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                  {product.summary}
                </p>
              </div>

              {/* Safety Alert Banner */}
              <SafetyAlertBanner alert={product.safetyAlert} />

              {/* Quick Eco & Repair Metas */}
              <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <Wrench className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                    <span>Reparabilidade</span>
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {product.reparabilityIndex}<span className="text-xs text-slate-600 dark:text-slate-400">/10</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Eficiência</span>
                  </div>
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
                    Classe {product.energyClass || 'A'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 min-[400px]:col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-300" />
                    <span>Certificações</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 truncate" title={product.certifications.join(', ')}>
                    {product.certifications[0] || 'Conforme'}
                  </div>
                </div>
              </div>

              {/* Pros & Cons Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                  <div className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                    <span>Pontos Fortes</span>
                  </div>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc pl-4">
                    {product.pros.map((pro, idx) => (
                      <li key={idx}>{pro}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span>Pontos de Atenção</span>
                  </div>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc pl-4">
                    {product.cons.map((con, idx) => (
                      <li key={idx}>{con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs for In-Depth Data */}
          <div className="border-b border-slate-200 dark:border-slate-800 pt-4">
            <div className="flex gap-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab('pilares')}
                className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'pilares'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Avaliação dos 4 Pilares</span>
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'specs'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Ficha Técnica Detalhada</span>
              </button>
              <button
                onClick={() => setActiveTab('precos')}
                className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'precos'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Cotações e Lojas</span>
              </button>
              <button
                onClick={() => setActiveTab('fontes')}
                className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'fontes'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Fontes das Informações</span>
              </button>
            </div>
          </div>

          {/* Tab 1: 4 Pilares Justificados */}
          {activeTab === 'pilares' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Qualidade */}
                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 font-bold text-sm text-blue-950 dark:text-blue-300">
                      <Award className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                      <span>1. Qualidade & Durabilidade</span>
                    </div>
                    <span className="text-sm font-extrabold text-blue-600 dark:text-blue-300">{product.scores.quality.toFixed(1)}/10</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {product.pillarNotes.quality}
                  </p>
                </div>

                {/* Segurança */}
                <div className="p-4 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/50">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 font-bold text-sm text-sky-950 dark:text-sky-300">
                      <ShieldCheck className="w-4 h-4 text-sky-700 dark:text-sky-300" />
                      <span>2. Segurança & Certificações</span>
                    </div>
                    <span className="text-sm font-extrabold text-sky-700 dark:text-sky-300">{product.scores.safety.toFixed(1)}/10</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {product.pillarNotes.safety}
                  </p>
                </div>

                {/* Sustentabilidade */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-slate-200">
                      <Leaf className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      <span>3. Sustentabilidade & Eficiência</span>
                    </div>
                    <span className="text-sm font-extrabold text-slate-700 dark:text-slate-300">{product.scores.sustainability.toFixed(1)}/10</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {product.pillarNotes.sustainability}
                  </p>
                </div>

                {/* Custo-Benefício */}
                <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 font-bold text-sm text-indigo-950 dark:text-indigo-300">
                      <Coins className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
                      <span>4. Custo-Benefício & Valor Real</span>
                    </div>
                    <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-300">{product.scores.costBenefit.toFixed(1)}/10</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {product.pillarNotes.costBenefit}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Ficha Técnica */}
          {activeTab === 'specs' && (
            <div className="animate-in fade-in duration-200">
              {product.specificationSource && <p className="mb-3 text-xs text-slate-600 dark:text-slate-400">Referência dos dados físicos: <a href={product.specificationSource.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-300 underline">{product.specificationSource.title}</a>. Medidas podem variar por configuração.</p>}

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <tbody>
                    {Object.entries(product.specs).map(([specKey, specVal], idx) => (
                      <tr
                        key={specKey}
                        className={idx % 2 === 0 ? 'bg-slate-50/70 dark:bg-slate-900/40' : 'bg-white dark:bg-slate-950'}
                      >
                        <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 w-1/3 border-r border-slate-200 dark:border-slate-800">
                          {specKey}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                          {specVal}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Cotações de Preço */}
          {activeTab === 'precos' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                Comparação de cotações em diferentes varejistas:
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-2.5 font-bold text-slate-700 dark:text-slate-300">Loja / Fornecedor</th>
                      <th className="px-4 py-2.5 font-bold text-slate-700 dark:text-slate-300">Preço Cotado</th>
                      <th className="px-4 py-2.5 font-bold text-slate-700 dark:text-slate-300">Disponibilidade</th>
                      <th className="px-4 py-2.5 font-bold text-slate-700 dark:text-slate-300 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceQuotes.map((quote, idx) => (
                      <tr
                        key={idx}
                        className={`border-b border-slate-100 dark:border-slate-800 ${
                          quote.isLowestPrice ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                        }`}
                      >
                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                          {quote.storeName}
                        </td>
                        <td className="px-4 py-3 font-extrabold text-slate-900 dark:text-white">
                          R$ {quote.price.toLocaleString('pt-BR')}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                          {quote.available ? 'Em estoque' : 'Indisponível'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {quote.isLowestPrice ? (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-brand-action text-white">
                              Menor Preço
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-600 dark:text-slate-400">
                              +R$ {(quote.price - product.price).toLocaleString('pt-BR')}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 4: Fontes Transparentes */}
          {activeTab === 'fontes' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="space-y-2.5">
                {product.sources.map((src, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {src.title}
                        </span>
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {src.type}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        Órgão / Responsável: <span className="font-medium text-slate-700 dark:text-slate-300">{src.organization}</span> • Data: {src.date}
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 shrink-0">
                      <span>{src.urlLabel}</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
