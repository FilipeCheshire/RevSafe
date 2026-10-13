import { Product, RecommendationPreferences, RecommendationItem } from '../types';
import { MOCK_PRODUCTS } from '../data/mockProducts';

export function getRecommendations(
  prefs: RecommendationPreferences,
  productsList: Product[] = MOCK_PRODUCTS
): RecommendationItem[] {
  // 1. Filtragem inicial
  let filtered = productsList.filter((prod) => {
    if (prefs.category !== 'all' && prod.category !== prefs.category) {
      return false;
    }

    if (prefs.requireNoAlerts && prod.safetyAlert.hasAlert) {
      return false;
    }

    // Permitir produtos até 15% acima do orçamento para fins de comparação honesta de valor agregado
    if (prefs.budgetMax > 0 && prod.price > prefs.budgetMax * 1.18) {
      return false;
    }

    return true;
  });

  if (filtered.length === 0) {
    // Se nenhum passou no filtro estrito de orçamento, buscar os mais próximos
    filtered = productsList.filter(
      (p) => prefs.category === 'all' || p.category === prefs.category
    );
  }

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
  const evaluated: RecommendationItem[] = filtered.map((prod) => {
    let score =
      prod.scores.quality * 10 * wQuality +
      prod.scores.safety * 10 * wSafety +
      prod.scores.sustainability * 10 * wSust +
      prod.scores.costBenefit * 10 * wCost;

    const reasons: string[] = [];
    const tradeoffs: string[] = [];

    // Ajuste por orçamento
    if (prefs.budgetMax > 0) {
      if (prod.price <= prefs.budgetMax) {
        const savingsPct = Math.round(((prefs.budgetMax - prod.price) / prefs.budgetMax) * 100);
        if (savingsPct >= 20) {
          score += 4;
          reasons.push(`Economia de ${savingsPct}% em relação ao teto do seu orçamento.`);
        } else {
          score += 2;
          reasons.push('Se encaixa perfeitamente dentro da margem de investimento informada.');
        }
      } else {
        const overPct = Math.round(((prod.price - prefs.budgetMax) / prefs.budgetMax) * 100);
        score -= overPct * 0.4;
        tradeoffs.push(`Preço R$ ${(prod.price - prefs.budgetMax).toLocaleString('pt-BR')} acima do orçamento inicial.`);
      }
    }

    // Alinhamento com pesos do usuário
    if (prefs.weights.safety >= 4 && prod.scores.safety >= 9.0) {
      score += 3;
      reasons.push(`Nota de Segurança exemplar (${prod.scores.safety.toFixed(1)}/10) com certificações rigorosas.`);
    }

    if (prefs.weights.sustainability >= 4 && prod.scores.sustainability >= 8.8) {
      score += 3;
      reasons.push(`Alto índice ecológico com selo de eficiência ${prod.energyClass || 'A'} e reparabilidade de ${prod.reparabilityIndex}/10.`);
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
      matchScore,
      reasons,
      tradeoffs,
      tag,
    };
  });

  // Ordenar decrescente pelo matchScore
  evaluated.sort((a, b) => b.matchScore - a.matchScore);

  // Garantir que o top 1 seja explicitamente marcado como Melhor Compatibilidade se tiver boa pontuação
  if (evaluated.length > 0 && evaluated[0].matchScore >= 80) {
    evaluated[0].tag = 'Melhor Compatibilidade';
  }

  return evaluated;
}
