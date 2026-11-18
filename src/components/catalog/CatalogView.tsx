import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  LayoutGrid,
  List,
  RotateCcw,
  X
} from 'lucide-react';
import { Product, Category } from '../../types';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import { matchesProductSearch } from '../../services/productSearch';
import { ProductCard } from '../products/ProductCard';

interface CatalogViewProps {
  onOpenProductDetail: (product: Product) => void;
  comparedIds: string[];
  onToggleCompare: (product: Product) => void;
  favoritesIds: string[];
  onToggleFavorite: (productId: string) => void;
  initialSearch?: string;
  initialCategory?: Category | 'all';
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  onOpenProductDetail,
  comparedIds,
  onToggleCompare,
  favoritesIds,
  onToggleFavorite,
  initialSearch = '',
  initialCategory = 'all',
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [minScore, setMinScore] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(Infinity);
  const [onlyNoAlerts, setOnlyNoAlerts] = useState<boolean>(false);
  const [onlyTopEco, setOnlyTopEco] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<
    'overall' | 'price_asc' | 'price_desc' | 'costBenefit' | 'safety' | 'sustainability'
  >('overall');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => { setSearchTerm(initialSearch); setSelectedCategory(initialCategory); }, [initialSearch, initialCategory]);

  const allBrands = useMemo(() => {
    return Array.from(new Set(MOCK_PRODUCTS.map((p) => p.brand))).sort();
  }, []);

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((prod) => {
      if (!matchesProductSearch(prod, searchTerm)) return false;

      if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
        return false;
      }

      if (selectedBrand !== 'all' && prod.brand !== selectedBrand) {
        return false;
      }

      if (minScore > 0 && prod.scores.overall < minScore) {
        return false;
      }

      if (prod.price > maxPrice) {
        return false;
      }

      if (onlyNoAlerts && prod.safetyAlert.hasAlert) {
        return false;
      }

      if (onlyTopEco && prod.scores.sustainability < 8.5) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'overall') return b.scores.overall - a.scores.overall;
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'costBenefit') return b.scores.costBenefit - a.scores.costBenefit;
      if (sortBy === 'safety') return b.scores.safety - a.scores.safety;
      if (sortBy === 'sustainability') return b.scores.sustainability - a.scores.sustainability;
      return 0;
    });
  }, [
    searchTerm,
    selectedCategory,
    selectedBrand,
    minScore,
    maxPrice,
    onlyNoAlerts,
    onlyTopEco,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setMinScore(0);
    setMaxPrice(Infinity);
    setOnlyNoAlerts(false);
    setOnlyTopEco(false);
    setSortBy('overall');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'all' ||
    selectedBrand !== 'all' ||
    minScore > 0 ||
    Number.isFinite(maxPrice) ||
    onlyNoAlerts ||
    onlyTopEco;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Catálogo de Produtos
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
          Pesquise por nome, marca ou características técnicas com filtros combináveis.
        </p>
      </div>

      {/* Barra de Busca e Controles Rápidos */}
      <div className="bg-white dark:bg-slate-950 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Input de Busca */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-600 dark:text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por produto, marca ou especificação..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Botão de Filtros */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className={`py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                isFilterDrawerOpen || hasActiveFilters
                  ? 'bg-brand-action text-white shadow-sm'
                  : 'border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filtros {hasActiveFilters ? '(Ativos)' : ''}</span>
            </button>

            {/* Ordenação */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-2.5 px-3.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="overall">Nota Geral</option>
                <option value="price_asc">Menor Preço</option>
                <option value="price_desc">Maior Preço</option>
                <option value="costBenefit">Custo-Benefício</option>
                <option value="safety">Segurança</option>
                <option value="sustainability">Sustentabilidade</option>
              </select>
            </div>

            {/* Alternar Visualização Grade / Lista */}
            <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
                title="Modo Grade"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
                title="Modo Lista"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Categorias Rápidas */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'smartphones', label: 'Smartphones' },
            { id: 'notebooks', label: 'Notebooks' },
            { id: 'eletrodomesticos', label: 'Eletrodomésticos' },
            { id: 'audio', label: 'Áudio & Fones' },
            { id: 'monitores', label: 'Monitores' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`py-1.5 px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-brand-action text-white font-semibold'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Painel Expandível de Filtros */}
      {isFilterDrawerOpen && (
        <div className="bg-white dark:bg-slate-950 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm mb-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 section-band mb-4">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-300" />
              Filtros Avançados
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-700 dark:text-rose-300 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Limpar Filtros
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Preço Máximo */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                <span>Preço Máximo:</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {Number.isFinite(maxPrice) ? `Até R$ ${maxPrice.toLocaleString('pt-BR')}` : 'Sem limite'}
                </span>
              </div>
              <input
                type="range"
                min="400"
                max="20000"
                step="200"
                value={Number.isFinite(maxPrice) ? maxPrice : 20000}
                onChange={(e) => setMaxPrice(Number(e.target.value) === 20000 ? Infinity : Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Nota Mínima */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                <span>Nota Mínima:</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {minScore === 0 ? 'Qualquer' : `${minScore.toFixed(1)}+`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="9.2"
                step="0.2"
                value={minScore}
                onChange={(e) => setMinScore(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Marca */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Marca:
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-white"
              >
                <option value="all">Todas as Marcas</option>
                {allBrands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Toggles */}
            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyNoAlerts}
                  onChange={(e) => setOnlyNoAlerts(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Apenas sem alertas de recall
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyTopEco}
                  onChange={(e) => setOnlyTopEco(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Alta sustentabilidade (8.5+)
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Resultados e Grid de Produtos */}
      <div className="mb-4 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        <span>
          Exibindo <b>{filteredProducts.length}</b> de <b>{MOCK_PRODUCTS.length}</b> produtos
        </span>
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="text-blue-600 dark:text-blue-300 hover:underline font-semibold cursor-pointer"
          >
            Resetar filtros
          </button>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-white dark:bg-slate-950 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 my-8">
          <div className="w-14 h-14 mx-auto rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-400 mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
            Nenhum produto encontrado
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto mb-6">
            Tente flexibilizar os filtros de preço, marca ou termo de busca.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-brand-action hover:bg-brand-action-hover text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {filteredProducts.map((prod) => (
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
      )}
    </div>
  );
};
