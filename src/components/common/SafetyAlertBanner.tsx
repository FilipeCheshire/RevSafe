import React from 'react';
import { AlertTriangle, AlertOctagon, CheckCircle2, Info } from 'lucide-react';
import { SafetyAlert } from '../../types';

interface SafetyAlertBannerProps {
  alert: SafetyAlert;
  compact?: boolean;
}

export const SafetyAlertBanner: React.FC<SafetyAlertBannerProps> = ({
  alert,
  compact = false,
}) => {
  if (!alert.hasAlert) {
    if (compact) {
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Sem Alertas Registrados</span>
        </div>
      );
    }

    return (
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 text-blue-950 dark:text-blue-200">
        <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="flex-1 text-sm">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-semibold">Segurança Verificada</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
              {alert.isSimulated ? 'Dados Demonstrativos' : 'Oficial'}
            </span>
          </div>
          <p className="text-blue-900 dark:text-blue-300 leading-relaxed text-xs sm:text-sm">
            {alert.description || 'Nenhum histórico de recall, sobreaquecimento ou anomalia elétrica reportado nos testes técnicos da plataforma.'}
          </p>
        </div>
      </div>
    );
  }

  const isSevere = alert.severity === 'recall' || alert.severity === 'warning';
  const Icon = isSevere ? AlertOctagon : AlertTriangle;
  const colorClasses = isSevere
    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200'
    : 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800 text-yellow-950 dark:text-yellow-200';

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
        <Icon className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
        <span>{alert.title}</span>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl border ${colorClasses}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 shrink-0 mt-0.5">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-bold text-sm sm:text-base">{alert.title}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100">
              Alerta de Segurança
            </span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed mb-2">
            {alert.description}
          </p>
          {alert.affectedBatches && (
            <div className="text-xs bg-amber-100/70 dark:bg-amber-900/40 p-2 rounded-lg border border-amber-200 dark:border-amber-800 inline-block">
              <span className="font-semibold">Lotes informados:</span> {alert.affectedBatches}
            </div>
          )}
          {alert.date && (
            <div className="text-[11px] opacity-100 mt-2 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              <span>Data do registro: {alert.date}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
