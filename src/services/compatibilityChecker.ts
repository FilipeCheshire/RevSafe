import type { PCBuildState, CompatibilityIssue } from '../types';
import { calculateBuildCost, totalRamModules } from './pcBuild';

export interface SystemPowerReport {
  estimatedDrawWatts: number;
  recommendedPsuWatts: number;
  currentPsuWatts: number;
  marginWatts: number;
  status: 'safe' | 'tight' | 'critical' | 'no_psu';
}

export function calculateEstimatedPower(build: PCBuildState): SystemPowerReport {
  // External monitors are priced in the build but are not powered by the PC PSU.
  const internal = [build.cpu, build.motherboard, ...build.ram, ...build.gpu, ...build.storage];
  const totalWatts = 45 + internal.reduce((total, c) => total + (c?.tdpWatts || 0), 0);
  const recommended = Math.max(450, Math.ceil(totalWatts * 1.35 / 50) * 50, ...build.gpu.map(c => c.recommendedPsuWattage || 0));
  const current = build.psu?.wattage || 0;
  return {
    estimatedDrawWatts: totalWatts, recommendedPsuWatts: recommended, currentPsuWatts: current,
    marginWatts: current ? current - totalWatts : 0,
    status: !current ? 'no_psu' : current < totalWatts ? 'critical' : current < recommended ? 'tight' : 'safe',
  };
}

export function checkCompatibility(build: PCBuildState): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];
  const add = (type: CompatibilityIssue['type'], title: string, description: string, recommendation?: string) => issues.push({ type, title, description, recommendation });
  if (build.cpu?.socket && build.motherboard?.socket && build.cpu.socket !== build.motherboard.socket) {
    add('error', 'Incompatibilidade de soquete', `O processador usa ${build.cpu.socket}, mas a placa-mãe usa ${build.motherboard.socket}.`, 'Selecione processador e placa-mãe com o mesmo soquete.');
  }
  for (const ram of [...new Map(build.ram.map(c => [c.id, c])).values()]) {
    if (build.motherboard?.supportedRamType && ram.ramType !== build.motherboard.supportedRamType) {
      add('error', 'Incompatibilidade no tipo de memória RAM', `${ram.name} usa ${ram.ramType}; a placa-mãe aceita ${build.motherboard.supportedRamType}.`, 'Troque este kit por um tipo de memória compatível.');
    } else if (build.cpu?.socket === 'AM5' && ram.ramType === 'DDR4') {
      add('error', 'Processador AM5 requer DDR5', `${ram.name} não é compatível com o controlador de memória do processador AM5.`);
    }
  }
  const modules = totalRamModules(build);
  if (build.motherboard?.memorySlots && modules > build.motherboard.memorySlots) {
    add('error', 'Slots de memória insuficientes', `Foram selecionados ${modules} módulos em ${build.ram.length} kit(s), mas a placa-mãe possui ${build.motherboard.memorySlots} slots.`, 'Reduza a quantidade de kits ou escolha uma placa-mãe com mais slots.');
  }
  if (build.ram.length > 1) {
    add('warning', 'Verifique a combinação de kits de RAM', 'Kits separados, mesmo com o mesmo nome, exigem confirmação de compatibilidade e estabilidade. A contagem considera os módulos de cada kit.', 'Confira a lista de memórias suportadas pela placa-mãe e os limites do processador.');
  }
  if (build.motherboard?.storageSlots && build.storage.length > build.motherboard.storageSlots) {
    add('error', 'Slots M.2 insuficientes', `Foram selecionados ${build.storage.length} SSDs M.2, mas a placa-mãe oferece ${build.motherboard.storageSlots} slots M.2.`, 'Reduza os SSDs ou selecione uma placa com mais conexões.');
  }
  if (build.gpu.length > 1) {
    add('warning', 'Múltiplas placas de vídeo exigem verificação', 'Confirme os slots PCIe, o espaço no gabinete e os conectores da fonte. A montagem não pressupõe aumento automático de desempenho nem suporte a SLI/CrossFire.');
  }
  if (build.monitor.length > 1) {
    add('warning', 'Confira as saídas de vídeo', `Foram selecionados ${build.monitor.length} monitores. Confirme o número e o tipo de conexões disponíveis nas GPUs ou no vídeo integrado.`);
  }
  if (build.motherboard?.formFactor === 'ATX' && build.case?.formFactor === 'Micro-ATX') {
    add('error', 'Gabinete pequeno para a placa-mãe', 'Uma placa ATX não cabe no gabinete Micro-ATX selecionado.');
  }
  const power = calculateEstimatedPower(build);
  if (power.status === 'critical') add('error', 'Potência da fonte insuficiente', `O consumo estimado é ${power.estimatedDrawWatts} W e a fonte oferece ${power.currentPsuWatts} W.`, `Selecione uma fonte de pelo menos ${power.recommendedPsuWatts} W.`);
  if (power.status === 'tight') add('warning', 'Margem elétrica reduzida', `A fonte suporta a estimativa de ${power.estimatedDrawWatts} W, mas a recomendação com margem é ${power.recommendedPsuWatts} W.`);
  if (build.cpu && !build.gpu.length && /(?:\b\d+F\b|\b\d+KF\b|Ryzen 5 5600\b)/i.test(build.cpu.name)) {
    add('warning', 'Processador sem vídeo integrado', 'O processador selecionado precisa de uma placa de vídeo dedicada para fornecer imagem.');
  }
  const cost = calculateBuildCost(build);
  if (build.targetBudget > 0 && cost > build.targetBudget) {
    add('info', 'Teto de orçamento excedido', `O total de R$ ${cost.toLocaleString('pt-BR')} supera o orçamento em R$ ${(cost - build.targetBudget).toLocaleString('pt-BR')}.`);
  }
  return issues;
}
