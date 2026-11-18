import React from 'react';
import { Heart, Scale, Check, ShieldAlert, Star } from 'lucide-react';
import { Product } from '../../types';
import { PillarBadge } from '../common/PillarBadge';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  isCompared: boolean;
  onToggleCompare: (product: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  isCompared,
  onToggleCompare,
  isFavorite,
  onToggleFavorite,
}) => {
  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case 'Escolha Imparcial':
        return 'bg-brand-action text-white';
      case 'Melhor Custo-Benefício':
        return 'bg-indigo-600 text-white';
      case 'Líder em Segurança':
        return 'bg-sky-700 text-white';
      case 'Sustentabilidade Top':
        return 'bg-slate-800 text-white';
      case 'Sob Análise':
        return 'bg-amber-700 text-white';
      default:
        return 'bg-slate-800 text-white';
    }
  };

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Top Media Bar */}
      <div
        className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800/80 overflow-hidden cursor-pointer"
        onClick={() => onOpenDetails(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10">
          {product.badge && (
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm tracking-wide ${getBadgeStyle(product.badge)}`}>
              {product.badge}
            </span>
          )}

          {product.safetyAlert.hasAlert && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-amber-700 text-white shadow-sm flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              Alerta de Lote
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isFavorite
              ? 'bg-rose-50 text-rose-500 shadow-sm'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-300 hover:bg-white dark:hover:bg-slate-800'
          }`}
          title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Overall Score Badge */}
        <div className="absolute bottom-3 right-3 z-10">
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg shadow-md backdrop-blur-md font-bold text-xs bg-brand-action text-white">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{product.scores.overall.toFixed(1)}</span>
            <span className="text-[10px] opacity-100">/10</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {product.brand}
            </span>
            <span>{product.categoryLabel}</span>
          </div>

          <h3
            onClick={() => onOpenDetails(product)}
            className="font-bold text-slate-900 dark:text-white text-base line-clamp-1 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors cursor-pointer mb-1.5"
            title={product.name}
          >
            {product.name}
          </h3>

          <p className="text-slate-600 dark:text-slate-300 text-xs line-clamp-2 leading-relaxed mb-3">
            {product.summary}
          </p>

          {/* 4 Pillars Mini Grid */}
          <div className="grid grid-cols-1 gap-2 mb-4">
            <PillarBadge pillar="quality" score={product.scores.quality} size="sm" />
            <PillarBadge pillar="safety" score={product.scores.safety} size="sm" />
            <PillarBadge pillar="sustainability" score={product.scores.sustainability} size="sm" />
            <PillarBadge pillar="costBenefit" score={product.scores.costBenefit} size="sm" />
          </div>
        </div>

        {/* Pricing and Action Footer */}
        <div className="pt-3 section-band">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
            <div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Preço médio apurado</div>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-lg font-extrabold whitespace-nowrap text-slate-900 dark:text-white">
                  R$ {product.price.toLocaleString('pt-BR')}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs whitespace-nowrap text-slate-600 dark:text-slate-400 line-through">
                    R$ {product.originalPrice.toLocaleString('pt-BR')}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 block">Eficiência</span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded">
                Classe {product.energyClass || 'A'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenDetails(product)}
              className="flex-1 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors text-center cursor-pointer"
            >
              Ficha Técnica
            </button>

            <button
              onClick={() => onToggleCompare(product)}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isCompared
                  ? 'bg-brand-action text-white shadow-sm'
                  : 'border border-slate-300 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-300'
              }`}
              title={isCompared ? 'Remover da comparação' : 'Adicionar ao comparador'}
            >
              {isCompared ? <Check className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
              <span>{isCompared ? 'Comparando' : 'Comparar'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
