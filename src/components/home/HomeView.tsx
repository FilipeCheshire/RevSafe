import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  Award,
  Leaf,
  Coins,
  ArrowRight,
  Scale,
  Sparkles,
  Cpu,
  AlertTriangle,
  Smartphone,
  Laptop,
  UtensilsCrossed,
  Headphones,
  Tv
} from 'lucide-react';
import { Category, Product } from '../../types';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import { AnimatedButton } from '../common/AnimatedButton';
import { ProductCard } from '../products/ProductCard';

interface HomeViewProps {
  onSearch: (query: string) => void;
  onSelectCategory: (cat: Category) => void;
  onOpenProductDetail: (product: Product) => void;
  comparedIds: string[];
  onToggleCompare: (product: Product) => void;
  favoritesIds: string[];
  onToggleFavorite: (productId: string) => void;
  onNavigateTab: (tab: 'catalog' | 'compare' | 'recommendations' | 'pcbuilder' | 'chat') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSearch,
  onSelectCategory,
  onOpenProductDetail,
  comparedIds,
  onToggleCompare,
  favoritesIds,
  onToggleFavorite,
  onNavigateTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const featuredProducts = MOCK_PRODUCTS.slice(0, 4);
  const alertProduct = MOCK_PRODUCTS.find((p) => p.safetyAlert.hasAlert);

  const categories = [
    { id: 'smartphones', label: 'Smartphones', icon: Smartphone, count: '4 produtos' },
    { id: 'notebooks', label: 'Notebooks', icon: Laptop, count: '3 produtos' },
    { id: 'eletrodomesticos', label: 'Eletrodomésticos', icon: UtensilsCrossed, count: '3 produtos' },
    { id: 'audio', label: 'Áudio & Fones', icon: Headphones, count: '1 produto' },
    { id: 'monitores', label: 'Monitores', icon: Tv, count: '2 produtos' },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* HERO SECTION */}
      <section className="home-hero relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-slate-50 dark:from-slate-900/60 dark:via-slate-950 dark:to-black pt-12 sm:pt-16 pb-12 sm:pb-16 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950 px-3 py-1.5 text-xs font-semibold text-blue-800 dark:text-blue-200 mb-6"><ShieldCheck className="w-3.5 h-3.5" /> Mais clareza para sua próxima escolha</div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-tight">
            Escolha melhor.<br /><span className="text-blue-600 dark:text-blue-400">Compre com confiança.</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Avaliações multicritério baseadas em qualidade, segurança, sustentabilidade e custo-benefício para apoiar decisões de compra conscientes.
          </p>

          {/* Busca Rápida */}
          <div className="mt-8 max-w-2xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSearch(searchQuery);
              }}
              className="relative flex items-center shadow-md rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-1.5"
            >
              <Search className="w-4 h-4 text-slate-600 dark:text-slate-400 ml-3 shrink-0" />
              <input
                aria-label="Pesquisar produtos"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar smartphone, notebook, air fryer, monitor..."
                className="w-full min-w-0 py-2.5 px-3 text-xs sm:text-sm text-slate-900 dark:text-white bg-transparent focus:outline-none"
              />
              <AnimatedButton type="submit" compact>Buscar</AnimatedButton>
            </form>
          </div>

          {/* 4 Pilares de Avaliação */}
          <div className="grid grid-cols-1 min-[380px]:grid-cols-2 md:grid-cols-4 gap-4 mt-12 text-left">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 w-fit mb-2">
                <Award className="w-4 h-4" />
              </div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Qualidade</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">Durabilidade, materiais e resistência.</div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 w-fit mb-2">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Segurança</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">Certificações oficiais e monitoramento de falhas.</div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 w-fit mb-2">
                <Leaf className="w-4 h-4" />
              </div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Sustentabilidade</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">Consumo de energia e índice de reparabilidade.</div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 w-fit mb-2">
                <Coins className="w-4 h-4" />
              </div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Custo-Benefício</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">Preço amortizado pelo ciclo de vida útil.</div>
            </div>
          </div>

        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Categorias
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Consulte avaliações e especificações técnicas por segmento
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('catalog')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Ver Catálogo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id as Category)}
                className="group p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                    {cat.label}
                  </h3>
                </div>
                <div className="mt-3 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                  {cat.count}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PRODUTOS EM DESTAQUE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Produtos em Destaque
            </h2>
          </div>

          <button
            onClick={() => onNavigateTab('catalog')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Ver Todos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onOpenDetails={onOpenProductDetail}
              isCompared={comparedIds.includes(prod.id)}
              onToggleCompare={onToggleCompare}
              isFavorite={favoritesIds.includes(prod.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* BOLETIM DE SEGURANÇA E ALERTAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-900">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-amber-200 dark:border-amber-900">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-700 text-white">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  Segurança do Consumidor (RF-006)
                </span>
                <h3 className="text-base font-bold text-amber-950 dark:text-amber-200">
                  Alertas Técnicos de Sobreaquecimento e Recall
                </h3>
              </div>
            </div>
          </div>

          {alertProduct && (
            <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-amber-200 dark:border-amber-900">
              <div className="flex items-center gap-4">
                <img
                  src={alertProduct.image}
                  alt={alertProduct.name}
                  className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300">
                      Alerta Ativo
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">{alertProduct.brand}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                    {alertProduct.name}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 max-w-xl">
                    {alertProduct.safetyAlert.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onOpenProductDetail(alertProduct)}
                className="py-2 px-4 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
              >
                Ver Relatório
              </button>
            </div>
          )}
        </div>
      </section>

      {/* MÓDULOS DE ACESSO RÁPIDO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Comparador */}
          <div
            onClick={() => onNavigateTab('compare')}
            className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="p-2.5 rounded-xl bg-brand-action text-white w-fit mb-3">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Comparador Lado a Lado
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Compare de 2 a 4 produtos em atributos equivalentes com diferenças e prós/contras destacados.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-900 text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <span>Acessar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Recomendador */}
          <div
            onClick={() => onNavigateTab('recommendations')}
            className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="p-2.5 rounded-xl bg-brand-action text-white w-fit mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Recomendações
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Informe orçamento, objetivo de uso e preferências para receber opções recomendadas com justificativas.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-900 text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <span>Acessar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Monte seu PC */}
          <div
            onClick={() => onNavigateTab('pcbuilder')}
            className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="p-2.5 rounded-xl bg-brand-action text-white w-fit mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Monte seu PC
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Validador de compatibilidade de soquete, memória e potência elétrica para montagem de computadores.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-900 text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <span>Acessar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
