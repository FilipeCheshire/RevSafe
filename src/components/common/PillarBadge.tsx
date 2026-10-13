import React from 'react';
import { Award, ShieldCheck, Leaf, Coins } from 'lucide-react';

interface PillarBadgeProps {
  pillar: 'quality' | 'safety' | 'sustainability' | 'costBenefit';
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const PillarBadge: React.FC<PillarBadgeProps> = ({
  pillar,
  score,
  size = 'md',
  showLabel = true,
}) => {
  const config = {
    quality: {
      label: 'Qualidade',
      icon: Award,
      color: 'text-blue-700 dark:text-blue-300',
      bg: 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900',
      bar: 'bg-brand',
    },
    safety: {
      label: 'Segurança',
      icon: ShieldCheck,
      color: 'text-sky-700 dark:text-sky-300',
      bg: 'bg-sky-50/80 dark:bg-sky-950/40 border-sky-200 dark:border-sky-900',
      bar: 'bg-sky-600',
    },
    sustainability: {
      label: 'Sustentabilidade',
      icon: Leaf,
      color: 'text-slate-700 dark:text-slate-300',
      bg: 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700',
      bar: 'bg-slate-700 dark:bg-slate-400',
    },
    costBenefit: {
      label: 'Custo-Benefício',
      icon: Coins,
      color: 'text-indigo-700 dark:text-indigo-300',
      bg: 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900',
      bar: 'bg-indigo-600',
    },
  }[pillar];

  const Icon = config.icon;

  if (size === 'sm') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs font-medium ${config.bg} ${config.color}`} title={`${config.label}: ${score.toFixed(1)}/10`}>
        <Icon className="w-3.5 h-3.5 shrink-0" />
        {showLabel && <span className="text-slate-700 dark:text-slate-300">{config.label}:</span>}
        <span className="font-bold">{score.toFixed(1)}</span>
      </div>
    );
  }

  return (
    <div className={`p-2.5 rounded-lg border flex flex-col justify-between ${config.bg}`}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <Icon className={`w-4 h-4 ${config.color}`} />
          {showLabel && <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{config.label}</span>}
        </div>
        <span className={`text-sm font-bold ${config.color}`}>{score.toFixed(1)}<span className="text-slate-600 dark:text-slate-400 text-xs font-normal">/10</span></span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${config.bar}`}
          style={{ width: `${Math.min(100, Math.max(0, score * 10))}%` }}
        />
      </div>
    </div>
  );
};
