import { Product, RecommendationPreferences, RecommendationItem } from '../types';
import { MOCK_PRODUCTS } from '../data/mockProducts';

export function hasEnvironmentalCertification(product: Product): boolean {
  return product.certifications.some(c => /energy star|epeat|tco|ecologo|procel/i.test(c));
}

export function getRecommendations(
  prefs: RecommendationPreferences,
  productsList: Product[] = MOCK_PRODUCTS
): RecommendationItem[] {
  // 1. Filtragem inicial
  const filtered = productsList.filter((prod) => {
    if (prefs.category !== 'all' && prod.category !== prefs.category) {
      return false;
    }

    if (prefs.requireNoAlerts && prod.safetyAlert.hasAlert) {
      return false;
    }

    if (prefs.requireEcoCert && !hasEnvironmentalCertification(prod)) return false;

    if (Number.isFinite(prefs.budgetMax) && prod.price > Math.max(0, prefs.budgetMax)) {
      return false;
    }

    return true;
  });

  // 2. Cálculo dos pesos normalizados
  const totalWeight =
    (prefs.weights.quality || 1) +
    (prefs.weights.safety || 1) +
    (prefs.weights.sustainability || 1) +
    (prefs.weights.costBenefit || 1);

  const wQuality = (prefs.weights.quality || 1) / totalWeight;
  const wSafety = (prefs.weights.safety || 1) / totalWeight;
  const wSust = (prefs.weights.sustainability || 1) / totalWeight;
  const wCost = (prefs.weights.costBenefit || 1) / totalWeight;

  // 3. Avaliação e pontuação
  const evaluated: (RecommendationItem & { rankingScore: number })[] = filtered.map((prod) => {
    let score =
      prod.scores.quality * 10 * wQuality +
      prod.scores.safety * 10 * wSafety +
      prod.scores.sustainability * 10 * wSust +
      prod.scores.costBenefit * 10 * wCost;

    const reasons: string[] = [];
    const tradeoffs: string[] = [];

    // Purpose changes ranking; it never relaxes explicit filters.
    let purposeBonus = 0;
    if (prefs.purpose === 'produtividade') {
      purposeBonus = prod.category === 'notebooks' ? 6 : prod.category === 'monitores' ? 4 : prod.category === 'smartphones' ? 2 : 0;
      if (purposeBonus) reasons.push('Perfil de trabalho e estudos: prioridade para esta categoria.');
    } else if (prefs.purpose === 'jogos') {
      purposeBonus = /gamer|odyssey/i.test(prod.name) ? 8 : prod.category === 'smartphones' && /120Hz|144Hz/i.test(prod.specs.Tela || '') ? 4 : 0;
      if (purposeBonus) reasons.push('Perfil de jogos: prioridade para características de tela voltadas a jogos no catálogo demonstrativo.');
    } else if (prefs.purpose === 'diaadia') {
      purposeBonus = prod.category === 'eletrodomesticos' ? 4 : prod.category === 'smartphones' ? 2 : 0;
      if (purposeBonus) reasons.push('Perfil doméstico: prioridade para produtos de uso cotidiano.');
    } else if (prefs.purpose === 'longevidade') {
      purposeBonus = (prod.scores.quality + prod.reparabilityIndex) * 0.3;
      reasons.push('Perfil de durabilidade: qualidade e índice de reparabilidade considerados na prioridade.');
    }
    score += purposeBonus;

    if (Number.isFinite(prefs.budgetMax) && prefs.budgetMax > 0) {
      const savingsPct = Math.round((prefs.budgetMax - prod.price) / prefs.budgetMax * 100);
      score += savingsPct >= 20 ? 4 : 2;
      reasons.push(savingsPct >= 20
        ? `Economia de ${savingsPct}% em relação ao teto do orçamento.`
        : 'Dentro do orçamento máximo informado.');
    }

    // Alinhamento com pesos do usuário
    if (prefs.weights.safety >= 4 && prod.scores.safety >= 9.0) {
      score += 3;
      reasons.push(`Nota de Segurança exemplar (${prod.scores.safety.toFixed(1)}/10) com certificações rigorosas.`);
    }

    if (prefs.weights.sustainability >= 4 && prod.scores.sustainability >= 8.8) {
      score += 3;
      reasons.push(`Alto índice ecológico com selo de eficiência ${prod.energyClass || 'não informado'} e reparabilidade de ${prod.reparabilityIndex}/10.`);
    }

    if (prefs.weights.quality >= 4 && prod.scores.quality >= 9.2) {
      score += 3;
      reasons.push(`Qualidade de construção de classe mundial com durabilidade de longo prazo estimada.`);
    }

    if (prefs.weights.costBenefit >= 4 && prod.scores.costBenefit >= 9.0) {
      score += 3;
      reasons.push(`Relação custo-benefício superior avaliada pela metodologia imparcial RevSafe.`);
    }

    // Alert check
    if (prod.safetyAlert.hasAlert) {
      score -= 20;
      tradeoffs.push(`Possui alerta de segurança registrado: "${prod.safetyAlert.title}".`);
    } else {
      reasons.push('Sem registros de falhas térmicas ou recalls nos testes demonstrativos.');
    }

    // Normalização final (limitar a 0 - 100)
    const matchScore = Math.min(99, Math.max(30, Math.round(score)));

    // Determinar etiqueta inteligente
    let tag: RecommendationItem['tag'] = 'Melhor Compatibilidade';
    if (prefs.budgetMax > 0 && prod.price < prefs.budgetMax * 0.7) {
      tag = 'Alternativa Econômica';
    } else if (prod.scores.overall >= 9.1 && prod.price >= 3000) {
      tag = 'Escolha Premium';
    } else if (prod.scores.sustainability >= 9.0) {
      tag = 'Foco Sustentável';
    }

    return {
      product: prod,
      rankingScore: score,
      matchScore,
      reasons,
      tradeoffs,
      tag,
    };
  });

  // Ordenar decrescente pelo matchScore
  evaluated.sort((a, b) => b.rankingScore - a.rankingScore || a.product.price - b.product.price);

  // Garantir que o top 1 seja explicitamente marcado como Melhor Compatibilidade se tiver boa pontuação
  if (evaluated.length > 0 && evaluated[0].matchScore >= 80) {
    evaluated[0].tag = 'Melhor Compatibilidade';
  }

  return evaluated.map(({ rankingScore: _rankingScore, ...item }) => item);
}
