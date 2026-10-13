import { PCBuildState, CompatibilityIssue } from '../types';

export interface SystemPowerReport {
  estimatedDrawWatts: number;
  recommendedPsuWatts: number;
  currentPsuWatts: number;
  marginWatts: number;
  status: 'safe' | 'tight' | 'critical' | 'no_psu';
}

export function calculateEstimatedPower(build: PCBuildState): SystemPowerReport {
  let totalWatts = 0;

  // Base platform draw (chipset, fans, LEDs, storage, audio)
  totalWatts += 45;

  if (build.cpu) {
    totalWatts += build.cpu.tdpWatts || 65;
  }
  if (build.motherboard) {
    totalWatts += build.motherboard.tdpWatts || 25;
  }
  if (build.ram) {
    totalWatts += build.ram.tdpWatts || 15;
  }
  if (build.gpu) {
    totalWatts += build.gpu.tdpWatts || 0;
  }
  if (build.storage) {
    totalWatts += build.storage.tdpWatts || 8;
  }

  // Recommended is typically ~1.35x estimated draw to stay around 50-70% PSU efficiency curve
  let recommended = Math.ceil((totalWatts * 1.35) / 50) * 50;
  if (build.gpu && build.gpu.recommendedPsuWattage && build.gpu.recommendedPsuWattage > recommended) {
    recommended = build.gpu.recommendedPsuWattage;
  }
  if (recommended < 450) recommended = 450;

  const currentPsuWatts = build.psu?.wattage || 0;
  const margin = currentPsuWatts > 0 ? currentPsuWatts - totalWatts : 0;

  let status: SystemPowerReport['status'] = 'no_psu';
  if (currentPsuWatts > 0) {
    if (currentPsuWatts < totalWatts) {
      status = 'critical';
    } else if (currentPsuWatts < recommended) {
      status = 'tight';
    } else {
      status = 'safe';
    }
  }

  return {
    estimatedDrawWatts: totalWatts,
    recommendedPsuWatts: recommended,
    currentPsuWatts,
    marginWatts: margin,
    status,
  };
}

export function checkCompatibility(build: PCBuildState): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];

  // 1. Soquete CPU vs Placa-Mãe
  if (build.cpu && build.motherboard) {
    if (build.cpu.socket && build.motherboard.socket && build.cpu.socket !== build.motherboard.socket) {
      issues.push({
        type: 'error',
        title: 'Incompatibilidade Crítica de Soquete',
        description: `O processador (${build.cpu.name}) requer o soquete ${build.cpu.socket}, mas a placa-mãe (${build.motherboard.name}) possui o soquete ${build.motherboard.socket}. O processador não encaixa fisicamente!`,
        componentA: build.cpu.name,
        componentB: build.motherboard.name,
        recommendation: `Troque a placa-mãe por um modelo com soquete ${build.cpu.socket} ou altere o processador.`,
      });
    }
  }

  // 2. Tipo de Memória RAM vs Placa-Mãe
  if (build.ram && build.motherboard) {
    if (build.motherboard.supportedRamType && build.ram.ramType && build.motherboard.supportedRamType !== build.ram.ramType) {
      issues.push({
        type: 'error',
        title: 'Incompatibilidade no Tipo de Memória RAM',
        description: `A placa-mãe selecionada suporta memórias ${build.motherboard.supportedRamType}, mas o kit de RAM escolhido é ${build.ram.ramType}. O encaixe dos pinos é fisicamente diferente.`,
        componentA: build.motherboard.name,
        componentB: build.ram.name,
        recommendation: `Selecione um kit de memória RAM ${build.motherboard.supportedRamType}.`,
      });
    }
  }

  // 3. Processador AM5 com RAM DDR4
  if (build.cpu && build.ram) {
    if (build.cpu.socket === 'AM5' && build.ram.ramType === 'DDR4') {
      issues.push({
        type: 'error',
        title: 'Processador AM5 Requer Memória DDR5',
        description: `A plataforma AMD AM5 (${build.cpu.name}) opera exclusivamente com memória DDR5. O kit selecionado é DDR4.`,
        componentA: build.cpu.name,
        componentB: build.ram.name,
        recommendation: 'Troque a memória para um kit DDR5 de 5600MHz ou 6000MHz.',
      });
    }
  }

  // 4. Formato de Gabinete vs Placa-mãe
  if (build.motherboard && build.case) {
    if (build.motherboard.formFactor === 'ATX' && build.case.formFactor === 'Micro-ATX') {
      issues.push({
        type: 'error',
        title: 'Gabinete Muito Pequeno para a Placa-Mãe',
        description: `A placa-mãe é padrão ATX (tamanho grande), mas o gabinete escolhido comporta apenas placas até Micro-ATX. Ela não caberá na furação interna.`,
        componentA: build.motherboard.name,
        componentB: build.case.name,
        recommendation: 'Escolha um gabinete padrão ATX (Mid-Tower) ou troque a placa-mãe por uma Micro-ATX.',
      });
    }
  }

  // 5. Potência da Fonte (PSU)
  const power = calculateEstimatedPower(build);
  if (build.psu) {
    if (power.status === 'critical') {
      issues.push({
        type: 'error',
        title: 'Potência da Fonte Insuficiente',
        description: `O consumo de pico estimado dos componentes é de ~${power.estimatedDrawWatts}W, superando os ${build.psu.wattage}W nominais da fonte. O computador sofrerá desligamentos forçados sob estresse.`,
        componentA: build.psu.name,
        recommendation: `Recomendamos uma fonte de no mínimo ${power.recommendedPsuWatts}W com certificação 80 Plus.`,
      });
    } else if (power.status === 'tight') {
      issues.push({
        type: 'warning',
        title: 'Margem Térmica e Elétrica Reduzida na Fonte',
        description: `A fonte de ${build.psu.wattage}W suporta a carga de ${power.estimatedDrawWatts}W, mas operará perto de 80-90% da capacidade. Para melhor eficiência, silêncio e futuros upgrades, o ideal seria ${power.recommendedPsuWatts}W.`,
        componentA: build.psu.name,
        recommendation: `Considere uma fonte de ${power.recommendedPsuWatts}W para garantir estabilidade máxima contra transientes.`,
      });
    }
  }

  // 6. Ausência de Vídeo Integrado sem GPU Dedicada
  if (build.cpu && !build.gpu) {
    const isIntelF = build.cpu.name.includes('F') || build.cpu.name.includes('KF');
    const isNoGpu = isIntelF;
    if (isNoGpu) {
      issues.push({
        type: 'warning',
        title: 'Processador sem Placa de Vídeo Integrada',
        description: `O processador ${build.cpu.name} não possui chip gráfico embutido. Sem uma placa de vídeo dedicada instalada, o computador não emitirá sinal para o monitor.`,
        componentA: build.cpu.name,
        recommendation: 'Adicione uma placa de vídeo dedicada (GPU) ou escolha um processador com vídeo integrado.',
      });
    }
  }

  // 7. Orçamento Estourado
  const totalCost = (build.cpu?.price || 0) +
    (build.motherboard?.price || 0) +
    (build.ram?.price || 0) +
    (build.gpu?.price || 0) +
    (build.storage?.price || 0) +
    (build.psu?.price || 0) +
    (build.case?.price || 0);

  if (build.targetBudget > 0 && totalCost > build.targetBudget) {
    const diff = totalCost - build.targetBudget;
    issues.push({
      type: 'info',
      title: 'Teto de Orçamento Excedido',
      description: `O custo total atual é de R$ ${totalCost.toLocaleString('pt-BR')}, superando o orçamento alvo de R$ ${build.targetBudget.toLocaleString('pt-BR')} em R$ ${diff.toLocaleString('pt-BR')}.`,
      recommendation: 'Você pode ajustar componentes como gabinete, SSD ou GPU para alinhar com o orçamento planejado.',
    });
  }

  return issues;
}
