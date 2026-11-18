import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ShieldCheck,
  Award,
  Leaf,
  Coins,
  ArrowRight,
  ArrowUp,
  Scale,
  Sparkles,
  Cpu,
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
import { ScrollExperience } from './ScrollExperience';
import { GridBackground } from '../common/GridBackground';

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
  const homeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    homeRef.current?.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const featuredProducts = MOCK_PRODUCTS.slice(0, 4);


  const categories = [
    { id: 'smartphones', label: 'Smartphones', icon: Smartphone, count: '4 produtos' },
    { id: 'notebooks', label: 'Notebooks', icon: Laptop, count: '3 produtos' },
    { id: 'eletrodomesticos', label: 'Eletrodomésticos', icon: UtensilsCrossed, count: '4 produtos' },
    { id: 'audio', label: 'Áudio & Fones', icon: Headphones, count: '2 produtos' },
    { id: 'monitores', label: 'Monitores', icon: Tv, count: '2 produtos' },
  ];

  return (
    <div ref={homeRef} className="home-sections">
      <ScrollExperience>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSearch(searchQuery);
              }}
              role="search"
              aria-label="Busca de produtos"
              className="flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <div className="min-w-0 w-full flex-1 flex items-center rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/25 transition-colors">
                <Search aria-hidden="true" className="w-5 h-5 text-slate-600 dark:text-slate-400 ml-3 shrink-0" />
                <input
                  id="home-product-search"
                  name="q"
                  aria-label="Pesquisar produtos"
                  type="search"
                  enterKeyHint="search"
                  autoComplete="off"
                  spellCheck={false}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Produto, marca ou categoria"
                  className="home-search-input block min-w-0 w-full flex-1 min-h-12 py-3 px-3 text-base text-slate-900 dark:text-white bg-transparent rounded-xl appearance-none"
                />
              </div>
              <AnimatedButton type="submit" className="w-full sm:w-auto min-h-12">Buscar</AnimatedButton>
            </form>
      </ScrollExperience>

      {/* CATEGORIAS */}
      <section id="home-categories" className="home-section grid-surface"><GridBackground surface /><div className="grid-surface-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-heading">
          <div>
            <h2 data-reveal className="section-title text-slate-900 dark:text-white">
              Categorias
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
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
      </div></section>

      {/* PRODUTOS EM DESTAQUE */}
      <section className="home-section grid-surface"><GridBackground surface /><div className="grid-surface-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-heading">
          <div>
            <h2 data-reveal className="section-title text-slate-900 dark:text-white">
              Produtos em Destaque
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Conheça os destaques da nossa avaliação multicritério.</p>
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
      </div></section>

      {/* MÓDULOS DE ACESSO RÁPIDO */}
      <section className="home-section grid-surface"><GridBackground surface /><div className="grid-surface-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-heading">
          <div><h2 data-reveal className="section-title text-slate-900 dark:text-white">Da dúvida à escolha</h2><p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Compare, descubra e monte. Encontre o caminho para sua próxima compra.</p></div>
        </div>
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
            <div className="mt-4 p-3 rounded-lg bg-blue-50/70 dark:bg-slate-900 text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
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
            <div className="mt-4 p-3 rounded-lg bg-blue-50/70 dark:bg-slate-900 text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
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
            <div className="mt-4 p-3 rounded-lg bg-blue-50/70 dark:bg-slate-900 text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <span>Acessar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div></section>
      <div className="home-return"><button onClick={() => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>Voltar ao topo e rever a experiência <ArrowUp className="w-4 h-4" /></button></div>
    </div>
  );
};
