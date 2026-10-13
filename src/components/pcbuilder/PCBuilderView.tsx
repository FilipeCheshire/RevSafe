import React, { useState } from 'react';
import {
  Cpu,
  HardDrive,
  Zap,
  Box,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  Layers,
  MonitorCheck,
  ShoppingCart,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { PCComponent, PCBuildState, PCPartType } from '../../types';
import { MOCK_PC_COMPONENTS } from '../../data/mockPCComponents';
import { checkCompatibility, calculateEstimatedPower } from '../../services/compatibilityChecker';

export const PCBuilderView: React.FC = () => {
  const [build, setBuild] = useState<PCBuildState>({
    cpu: MOCK_PC_COMPONENTS.find((c) => c.id === 'cpu-01') || null,
    motherboard: MOCK_PC_COMPONENTS.find((c) => c.id === 'mobo-02') || null,
    ram: MOCK_PC_COMPONENTS.find((c) => c.id === 'ram-01') || null,
    gpu: MOCK_PC_COMPONENTS.find((c) => c.id === 'gpu-02') || null,
    storage: MOCK_PC_COMPONENTS.find((c) => c.id === 'ssd-01') || null,
    psu: MOCK_PC_COMPONENTS.find((c) => c.id === 'psu-02') || null,
    case: MOCK_PC_COMPONENTS.find((c) => c.id === 'case-01') || null,
    targetBudget: 7000,
    targetPurpose: 'gaming',
  });

  const [activeSlot, setActiveSlot] = useState<PCPartType | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPriceQuotes, setShowPriceQuotes] = useState<Record<string, boolean>>({});

  const toggleQuotes = (slotId: string) => {
    setShowPriceQuotes((prev) => ({ ...prev, [slotId]: !prev[slotId] }));
  };

  const issues = checkCompatibility(build);
  const powerReport = calculateEstimatedPower(build);

  const totalCost =
    (build.cpu?.price || 0) +
    (build.motherboard?.price || 0) +
    (build.ram?.price || 0) +
    (build.gpu?.price || 0) +
    (build.storage?.price || 0) +
    (build.psu?.price || 0) +
    (build.case?.price || 0);

  // Cálculo da melhor cotação combinada (RF-010)
  const lowestPossibleTotal = [
    build.cpu,
    build.motherboard,
    build.ram,
    build.gpu,
    build.storage,
    build.psu,
    build.case,
  ].reduce((acc, comp) => {
    if (!comp) return acc;
    if (comp.priceQuotes && comp.priceQuotes.length > 0) {
      const minQuote = Math.min(...comp.priceQuotes.map((q) => q.price));
      return acc + minQuote;
    }
    return acc + comp.price;
  }, 0);

  const budgetProgress =
    build.targetBudget > 0 ? Math.min(100, Math.round((totalCost / build.targetBudget) * 100)) : 0;

  const handleSelectComponent = (comp: PCComponent) => {
    setBuild((prev) => ({
      ...prev,
      [comp.type === 'motherboard' ? 'motherboard' : comp.type]: comp,
    }));
    setActiveSlot(null);
  };

  const handleRemoveSlot = (type: PCPartType) => {
    const key = type === 'motherboard' ? 'motherboard' : type;
    setBuild((prev) => ({
      ...prev,
      [key]: null,
    }));
  };

  const handleClearBuild = () => {
    setBuild({
      cpu: null,
      motherboard: null,
      ram: null,
      gpu: null,
      storage: null,
      psu: null,
      case: null,
      targetBudget: build.targetBudget,
      targetPurpose: build.targetPurpose,
    });
  };

  const applyPreset = (presetName: 'gamer-equilibrado' | 'alta-performance' | 'economico') => {
    if (presetName === 'gamer-equilibrado') {
      setBuild({
        cpu: MOCK_PC_COMPONENTS.find((c) => c.id === 'cpu-01') || null,
        motherboard: MOCK_PC_COMPONENTS.find((c) => c.id === 'mobo-02') || null,
        ram: MOCK_PC_COMPONENTS.find((c) => c.id === 'ram-01') || null,
        gpu: MOCK_PC_COMPONENTS.find((c) => c.id === 'gpu-02') || null,
        storage: MOCK_PC_COMPONENTS.find((c) => c.id === 'ssd-01') || null,
        psu: MOCK_PC_COMPONENTS.find((c) => c.id === 'psu-02') || null,
        case: MOCK_PC_COMPONENTS.find((c) => c.id === 'case-01') || null,
        targetBudget: 6500,
        targetPurpose: 'gaming',
      });
    } else if (presetName === 'alta-performance') {
      setBuild({
        cpu: MOCK_PC_COMPONENTS.find((c) => c.id === 'cpu-02') || null,
        motherboard: MOCK_PC_COMPONENTS.find((c) => c.id === 'mobo-01') || null,
        ram: MOCK_PC_COMPONENTS.find((c) => c.id === 'ram-01') || null,
        gpu: MOCK_PC_COMPONENTS.find((c) => c.id === 'gpu-01') || null,
        storage: MOCK_PC_COMPONENTS.find((c) => c.id === 'ssd-02') || null,
        psu: MOCK_PC_COMPONENTS.find((c) => c.id === 'psu-01') || null,
        case: MOCK_PC_COMPONENTS.find((c) => c.id === 'case-01') || null,
        targetBudget: 12000,
        targetPurpose: 'gaming',
      });
    } else if (presetName === 'economico') {
      setBuild({
        cpu: MOCK_PC_COMPONENTS.find((c) => c.id === 'cpu-04') || null,
        motherboard: MOCK_PC_COMPONENTS.find((c) => c.id === 'mobo-04') || null,
        ram: MOCK_PC_COMPONENTS.find((c) => c.id === 'ram-02') || null,
        gpu: MOCK_PC_COMPONENTS.find((c) => c.id === 'gpu-04') || null,
        storage: MOCK_PC_COMPONENTS.find((c) => c.id === 'ssd-01') || null,
        psu: MOCK_PC_COMPONENTS.find((c) => c.id === 'psu-03') || null,
        case: MOCK_PC_COMPONENTS.find((c) => c.id === 'case-02') || null,
        targetBudget: 3500,
        targetPurpose: 'gaming',
      });
    }
  };

  const handleCopyPartsList = () => {
    const lines = [
      `🖥️ Configuração Montada no RevSafe:`,
      `• Processador: ${build.cpu?.name || 'Não selecionado'} (R$ ${build.cpu?.price || 0})`,
      `• Placa-Mãe: ${build.motherboard?.name || 'Não selecionada'} (R$ ${build.motherboard?.price || 0})`,
      `• Memória RAM: ${build.ram?.name || 'Não selecionada'} (R$ ${build.ram?.price || 0})`,
      `• Placa de Vídeo: ${build.gpu?.name || 'Não selecionada'} (R$ ${build.gpu?.price || 0})`,
      `• Armazenamento: ${build.storage?.name || 'Não selecionado'} (R$ ${build.storage?.price || 0})`,
      `• Fonte de Alimentação: ${build.psu?.name || 'Não selecionada'} (R$ ${build.psu?.price || 0})`,
      `• Gabinete: ${build.case?.name || 'Não selecionado'} (R$ ${build.case?.price || 0})`,
      `\n💰 Custo Total: R$ ${totalCost.toLocaleString('pt-BR')}`,
      `⚡ Consumo Estimado: ~${powerReport.estimatedDrawWatts}W | Fonte Recomendada: ${powerReport.recommendedPsuWatts}W`,
      `🛡️ Status: ${issues.filter((i) => i.type === 'error').length === 0 ? '100% Compatível' : 'Possui Incompatibilidades'}`,
    ];
    navigator.clipboard?.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const slotsConfig: { type: PCPartType; label: string; icon: any }[] = [
    { type: 'cpu', label: 'Processador (CPU)', icon: Cpu },
    { type: 'motherboard', label: 'Placa-Mãe', icon: Layers },
    { type: 'ram', label: 'Memória RAM', icon: Box },
    { type: 'gpu', label: 'Placa de Vídeo (GPU)', icon: MonitorCheck },
    { type: 'storage', label: 'Armazenamento (SSD)', icon: HardDrive },
    { type: 'psu', label: 'Fonte de Alimentação (PSU)', icon: Zap },
    { type: 'case', label: 'Gabinete (Case)', icon: Box },
  ];

  const hasCriticalErrors = issues.some((i) => i.type === 'error');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Monte seu PC
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
          Selecione os componentes de hardware com validação em tempo real de soquete, tipo de memória RAM, consumo em Watts e comparação de preços entre lojas (RF-008, RF-009, RF-010).
        </p>
      </div>

      {/* Barra de Orçamento, Finalidade e Presets Rápidos */}
      <div className="bg-white dark:bg-slate-950 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Orçamento Alvo */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Orçamento Pretendido
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">R$</span>
              <input
                type="number"
                value={build.targetBudget || ''}
                onChange={(e) =>
                  setBuild({ ...build, targetBudget: parseInt(e.target.value) || 0 })
                }
                className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 5000"
              />
            </div>
          </div>

          {/* Finalidade */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Finalidade
            </label>
            <select
              value={build.targetPurpose}
              onChange={(e) =>
                setBuild({ ...build, targetPurpose: e.target.value as any })
              }
              className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="gaming">Jogos Eletrônicos (Gaming)</option>
              <option value="work">Trabalho Profissional, Edição & 3D</option>
              <option value="general">Uso Geral & Escritório</option>
            </select>
          </div>

          {/* Presets Rápidos */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Sugestões Prontas
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => applyPreset('economico')}
                className="py-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                Econômico (R$ 3.5k)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('gamer-equilibrado')}
                className="py-1.5 px-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 text-[11px] font-bold text-blue-700 dark:text-blue-300 transition-colors cursor-pointer"
              >
                Gamer 1440p (R$ 6.5k)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('alta-performance')}
                className="py-1.5 px-2.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 transition-colors cursor-pointer"
              >
                High-End
              </button>
            </div>
          </div>
        </div>

        {/* Barra de Progresso do Orçamento */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-850">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-600 dark:text-slate-400">
              Total Atual: <b className="text-slate-900 dark:text-white text-sm">R$ {totalCost.toLocaleString('pt-BR')}</b>
              {lowestPossibleTotal < totalCost && (
                <span className="ml-2 text-blue-600 dark:text-blue-400 font-semibold">
                  (Melhor cotação entre lojas: R$ {lowestPossibleTotal.toLocaleString('pt-BR')})
                </span>
              )}
            </span>
            <span className={totalCost > build.targetBudget ? 'text-rose-600 font-bold' : 'text-blue-600 dark:text-blue-400 font-bold'}>
              {budgetProgress}% do orçamento utilizado
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                totalCost > build.targetBudget ? 'bg-rose-500' : 'bg-brand'
              }`}
              style={{ width: `${budgetProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid Principal: Lista de Slots (Esquerda) e Painel de Compatibilidade (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Lista de Peças Selecionadas */}
        <div className="min-w-0 lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              Componentes Selecionados
            </h2>
            <button
              onClick={handleClearBuild}
              className="text-xs text-rose-700 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 flex items-center gap-1 cursor-pointer font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
          </div>

          {slotsConfig.map((slot) => {
            const comp = build[slot.type === 'motherboard' ? 'motherboard' : slot.type];
            const Icon = slot.icon;
            const isQuotesOpen = comp ? showPriceQuotes[comp.id] : false;

            return (
              <div
                key={slot.type}
                className="bg-white dark:bg-slate-950 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 flex-1 min-w-0 w-full sm:w-auto">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-400 shrink-0 overflow-hidden">
                      {comp ? (
                        <img
                          src={comp.image}
                          alt={comp.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        {slot.label}
                      </div>

                      {comp ? (
                        <div>
                          <div className="font-bold text-sm text-slate-900 dark:text-white truncate" title={comp.name}>
                            {comp.name}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2 flex-wrap">
                            <span>{comp.brand}</span>
                            {comp.socket && <span>• Soquete {comp.socket}</span>}
                            {comp.ramType && <span>• {comp.ramType}</span>}
                            {comp.supportedRamType && <span>• Suporta {comp.supportedRamType}</span>}
                            {comp.tdpWatts > 0 && <span>• {comp.tdpWatts}W TDP</span>}
                            {comp.wattage && <span>• {comp.wattage}W</span>}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-600 dark:text-slate-400 italic">
                          Slot vazio
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preço e Botões */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    {comp && (
                      <div className="text-right">
                        <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                          R$ {comp.price.toLocaleString('pt-BR')}
                        </div>
                        {comp.priceQuotes && comp.priceQuotes.length > 0 && (
                          <button
                            type="button"
                            onClick={() => toggleQuotes(comp.id)}
                            className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 justify-end"
                          >
                            <span>{comp.priceQuotes.length} cotações</span>
                            {isQuotesOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setActiveSlot(slot.type)}
                        className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          comp
                            ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                            : 'bg-brand-action hover:bg-brand-action-hover text-white shadow-sm'
                        }`}
                      >
                        {comp ? 'Trocar' : '+ Escolher'}
                      </button>

                      {comp && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSlot(slot.type)}
                          className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                          title="Remover"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Subtabela de Cotações de Preço em Lojas (RF-010) */}
                {comp && isQuotesOpen && comp.priceQuotes && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-850 animate-in fade-in text-xs">
                    <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                      <ShoppingCart className="w-3.5 h-3.5 text-blue-600" />
                      <span>Comparação de Preços entre Lojas (RF-010)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {comp.priceQuotes.map((q, qIdx) => (
                        <div
                          key={qIdx}
                          className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                            q.isLowestPrice
                              ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900'
                              : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <span className="font-medium text-slate-700 dark:text-slate-300">{q.storeName}</span>
                          <div className="text-right">
                            <span className="font-bold text-slate-900 dark:text-white">R$ {q.price.toLocaleString('pt-BR')}</span>
                            {q.isLowestPrice && (
                              <span className="block text-[9px] font-bold text-blue-600 uppercase">Menor</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Coluna Direita: Diagnóstico de Compatibilidade & Energia */}
        <div className="min-w-0 lg:col-span-4 space-y-6">
          {/* Card de Status de Compatibilidade */}
          <div className="bg-white dark:bg-slate-950 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                Verificação de Compatibilidade (RF-009)
              </span>
              {hasCriticalErrors ? (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                  Incompatível
                </span>
              ) : (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Compatível
                </span>
              )}
            </div>

            {issues.length === 0 ? (
              <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-300 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold mb-0.5">Componentes 100% Compatíveis</div>
                  <p className="text-blue-800 dark:text-blue-400 leading-relaxed text-[11px]">
                    Soquete, padrão de memória RAM e demanda elétrica conferem plenamente.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {issues.map((issue, idx) => {
                  const isErr = issue.type === 'error';
                  const isWarn = issue.type === 'warning';
                  const bg = isErr
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-300'
                    : isWarn
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-300'
                    : 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-300';
                  const Icon = isErr ? XCircle : isWarn ? AlertTriangle : CheckCircle2;

                  return (
                    <div key={idx} className={`p-3 rounded-xl border ${bg} text-xs space-y-1`}>
                      <div className="flex items-center gap-1.5 font-bold">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{issue.title}</span>
                      </div>
                      <p className="leading-relaxed text-[11px] opacity-90">
                        {issue.description}
                      </p>
                      {issue.recommendation && (
                        <div className="pt-1 text-[10px] font-semibold opacity-85">
                          👉 Solução: {issue.recommendation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Painel de Cálculo Elétrico da Fonte (PSU) */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span>Consumo Estimado (TDP)</span>
                </div>
                <span>~{powerReport.estimatedDrawWatts} Watts</span>
              </div>

              <div className="text-[11px] text-slate-600 dark:text-slate-400 flex justify-between">
                <span>Fonte Recomendada (+35% folga):</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {powerReport.recommendedPsuWatts}W ou mais
                </span>
              </div>

              <div className="text-[11px] text-slate-600 dark:text-slate-400 flex justify-between">
                <span>Fonte Selecionada:</span>
                <span className={`font-bold ${
                  powerReport.status === 'safe'
                    ? 'text-blue-600 dark:text-blue-400'
                    : powerReport.status === 'tight'
                    ? 'text-amber-600'
                    : powerReport.status === 'critical'
                    ? 'text-rose-600'
                    : 'text-slate-600 dark:text-slate-400'
                }`}>
                  {build.psu ? `${build.psu.wattage}W (${build.psu.efficiencyRating || '80 Plus'})` : 'Nenhuma'}
                </span>
              </div>
            </div>

            {/* Ação de Cópia */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleCopyPartsList}
                className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-blue-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copiado para área de transferência!' : 'Copiar Configuração Completa'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Seleção de Peças */}
      {activeSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-950 rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white capitalize">
                Selecionar {slotsConfig.find((s) => s.type === activeSlot)?.label}
              </h3>
              <button
                onClick={() => setActiveSlot(null)}
                className="p-1 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto py-4 space-y-2.5 flex-1">
              {MOCK_PC_COMPONENTS.filter((c) => c.type === activeSlot).map((comp) => {
                let isIncompatible = false;
                let reason = '';

                if (comp.type === 'cpu' && build.motherboard) {
                  if (comp.socket !== build.motherboard.socket) {
                    isIncompatible = true;
                    reason = `Soquete ${comp.socket} difere da placa (${build.motherboard.socket})`;
                  }
                }

                if (comp.type === 'motherboard' && build.cpu) {
                  if (comp.socket !== build.cpu.socket) {
                    isIncompatible = true;
                    reason = `Soquete ${comp.socket} incompatível com o processador (${build.cpu.socket})`;
                  }
                }

                if (comp.type === 'ram' && build.motherboard) {
                  if (build.motherboard.supportedRamType && comp.ramType !== build.motherboard.supportedRamType) {
                    isIncompatible = true;
                    reason = `Memória ${comp.ramType} incompatível com a placa (${build.motherboard.supportedRamType})`;
                  }
                }

                return (
                  <div
                    key={comp.id}
                    onClick={() => handleSelectComponent(comp)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                      isIncompatible
                        ? 'border-rose-200 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20 opacity-100 hover:opacity-100 hover:border-rose-400'
                        : 'border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-950/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={comp.image}
                        alt={comp.name}
                        className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-blue-600 uppercase">
                            {comp.brand}
                          </span>
                          {isIncompatible && (
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-100 dark:bg-rose-950 px-1.5 py-0.5 rounded">
                              Incompatível
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">
                          {comp.name}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          {isIncompatible ? (
                            <span className="text-rose-600 font-medium">{reason}</span>
                          ) : (
                            <span>Nota RevSafe: {comp.scores.overall.toFixed(1)}/10</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                        R$ {comp.price.toLocaleString('pt-BR')}
                      </div>
                      <span className="text-xs font-semibold text-blue-600">
                        Selecionar
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
