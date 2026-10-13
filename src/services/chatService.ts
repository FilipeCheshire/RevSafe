import { ChatMessage, Product } from '../types';
import { MOCK_PRODUCTS } from '../data/mockProducts';

export interface ChatResponse {
  message: string;
  isSimulated: boolean;
  referencedProducts?: Product[];
  suggestedPrompts?: string[];
}

export async function sendChatMessage(
  userQuery: string,
  history: ChatMessage[] = []
): Promise<ChatResponse> {
  const endpoint = process.env.NEXT_PUBLIC_CHAT_API_URL;
  if (!endpoint) return generateSimulatedResponse(userQuery);
  try {
    const apiUrl = new URL(endpoint);
    if (apiUrl.protocol !== 'https:' || apiUrl.username || apiUrl.password || apiUrl.search || apiUrl.hash) {
      return generateSimulatedResponse(userQuery);
    }
    const response = await fetch(apiUrl, {
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      redirect: 'error',
      signal: AbortSignal.timeout(15000),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userQuery,
        history: history.slice(-6).map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          content: m.content,
        })),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && typeof data.reply === 'string' && data.reply.length <= 20000) {
        return {
          message: data.reply,
          isSimulated: false,
          suggestedPrompts: Array.isArray(data.suggestedPrompts) ? data.suggestedPrompts.filter((p: unknown): p is string => typeof p === 'string' && p.length <= 300).slice(0, 6) : [
            'Compare esses produtos no Comparador RevSafe',
            'Qual o índice de reparabilidade?',
            'Verificar certificações de segurança',
          ],
        };
      }
    }
  } catch {
    // Falha silenciosa na rede ou endpoint não disponível - prossegue para simulação
  }

  // Fallback Inteligente Demonstrativo (Local Impartial AI Engine)
  return generateSimulatedResponse(userQuery);
}

function generateSimulatedResponse(query: string): ChatResponse {
  const q = query.toLowerCase();
  const referenced: Product[] = [];

  // 1. Comparação entre Galaxy S24 e iPhone 15
  if (
    (q.includes('galaxy') || q.includes('s24') || q.includes('samsung')) &&
    (q.includes('iphone') || q.includes('apple') || q.includes('15'))
  ) {
    const s24 = MOCK_PRODUCTS.find((p) => p.id === 'prod-sp-01');
    const ip15 = MOCK_PRODUCTS.find((p) => p.id === 'prod-sp-02');
    if (s24) referenced.push(s24);
    if (ip15) referenced.push(ip15);

    return {
      message: `Aqui está o confronto imparcial entre **Samsung Galaxy S24 Ultra** e **Apple iPhone 15** avaliado pela metodologia RevSafe:\n\n` +
        `• **Qualidade & Tela:** O Galaxy S24 Ultra se destaca pela tela plana com tratamento óptico anti-reflexo Gorilla Armor e chassi em titânio (Nota: 9.6). O iPhone 15 possui excelente pegada compacta de 171g e cores fundidas no vidro, mas a tela opera em 60Hz (Nota: 9.3).\n\n` +
        `• **Segurança & Privacidade:** Empate técnico em excelência. Ambos contam com enclaves de segurança em hardware dedicados (Samsung Knox e Apple Secure Enclave) e conformidade plena de emissões homologadas pela Anatel.\n\n` +
        `• **Sustentabilidade:** O Galaxy oferece compromisso de 7 anos de atualizações de SO. O iPhone lidera em pegada de carbono reduzida, uso de 100% cobalto reciclado na bateria e alta retenção de valor de revenda após 3 anos.\n\n` +
        `• **Veredito de Custo-Benefício:** Se você busca câmeras de longo alcance (zoom 5x), caneta S-Pen e produtividade multitarefa máxima, o S24 Ultra compensa o investimento. Para a maioria dos usuários que desejam fluidez diária, ecossistema estável e menor depreciação, o iPhone 15 (R$ 4.999) oferece custo por ano mais previsível.`,
      isSimulated: true,
      referencedProducts: referenced,
      suggestedPrompts: [
        'Abrir no Comparador lado a lado',
        'Qual tem a bateria que dura mais?',
        'Verificar índice de reparabilidade do iPhone 15',
      ],
    };
  }

  // 2. Air Fryer / Segurança / Recall
  if (q.includes('air fryer') || q.includes('fritadeira') || q.includes('recall') || q.includes('segurança')) {
    const walita = MOCK_PRODUCTS.find((p) => p.id === 'prod-el-01');
    const generica = MOCK_PRODUCTS.find((p) => p.id === 'prod-el-02');
    if (walita) referenced.push(walita);
    if (generica) referenced.push(generica);

    return {
      message: `Análise de Segurança para Fritadeiras sem Óleo (Air Fryers):\n\n` +
        `• **Modelo Aprovado sem Ressalvas:** A **Philips Walita Série 3000** obteve nota 9.6 em Segurança nos testes simulados. Possui carcaça "Cool Wall" com isolamento duplo (temperatura externa < 45°C), desligamento automático ao puxar o cesto e antiaderente certificado livre de PFOA e BPA.\n\n` +
        `• **Alerta Ativo no Banco RevSafe:** A **Fritadeira ElectroMaster Turbo 5L** possui alerta preventivo de lote (EM-2023-BR) no catálogo demonstrativo, devido a medições de temperatura no puxador que excederam 68°C em uso prolongado a 200°C.\n\n` +
        `**Dica RevSafe:** Sempre verifique o selo oficial Inmetro no plugue e carcaça, e dê preferência a cestos com fixação mecânica por parafuso duplo de aço inoxidável.`,
      isSimulated: true,
      referencedProducts: referenced,
      suggestedPrompts: [
        'Ver ficha técnica da Philips Walita',
        'Como funciona o índice de reparabilidade?',
        'Quais outras marcas são recomendadas?',
      ],
    };
  }

  // 3. Notebooks para trabalho ou estudo
  if (q.includes('notebook') || q.includes('laptop') || q.includes('estudo') || q.includes('trabalho') || q.includes('macbook')) {
    const macbook = MOCK_PRODUCTS.find((p) => p.id === 'prod-nb-01');
    const dell = MOCK_PRODUCTS.find((p) => p.id === 'prod-nb-02');
    const thinkpad = MOCK_PRODUCTS.find((p) => p.id === 'prod-nb-03');
    if (dell) referenced.push(dell);
    if (thinkpad) referenced.push(thinkpad);
    if (macbook) referenced.push(macbook);

    return {
      message: `Recomendações imparciais de notebooks categorizadas por perfil:\n\n` +
        `1. **Melhor Custo-Benefício até R$ 3.500:** **Dell Inspiron 15** (i5, 16GB RAM, SSD 512GB). Possui tampa inferior fácil de abrir para upgrades futuros de memória e assistência técnica com visita domiciliar em território nacional.\n\n` +
        `2. **Líder em Segurança Corporativa & Durabilidade:** **Lenovo ThinkPad E14 Gen 5** (Ryzen 7). Chassi aprovado em 12 normas de teste militar MIL-STD-810H, trava mecânica física na câmera e chip TPM de criptografia.\n\n` +
        `3. **Líder em Eficiência & Silêncio:** **MacBook Air M3**. Construção unibody com 50% de material reciclado, zero ruído de ventoinha e até 18 horas de bateria contínua.\n\n` +
        `Qual dessas faixas de investimento atende melhor o seu momento?`,
      isSimulated: true,
      referencedProducts: referenced,
      suggestedPrompts: [
        'Comparar Dell Inspiron vs ThinkPad E14',
        'Diferença de autonomia entre Windows e Mac',
        'Notebooks com alta reparabilidade',
      ],
    };
  }

  // 4. Monte seu PC / Hardware
  if (q.includes('pc') || q.includes('computador') || q.includes('processador') || q.includes('placa de vídeo') || q.includes('fonte') || q.includes('ryzen') || q.includes('rtx')) {
    return {
      message: `No módulo **Monte seu PC da RevSafe**, você conta com verificação técnica automatizada em tempo real:\n\n` +
        `• **Compatibilidade de Soquete:** Avisamos se você tentar combinar CPUs AM5 com placas-mãe AM4 ou LGA1700.\n` +
        `• **Tipo de Memória:** Checamos se a placa-mãe aceita DDR4 ou DDR5.\n` +
        `• **Cálculo de Potência (Watts):** Somamos o TDP real de processador, placa de vídeo e periféricos, recomendando uma fonte com 30% de margem de eficiência para evitar sobrecarga elétrica.\n\n` +
        `Você gostaria de uma sugestão pronta de configuração para Jogos (1080p / 1440p) ou Trabalho profissional?`,
      isSimulated: true,
      suggestedPrompts: [
        'Ir para o módulo Monte seu PC',
        'Qual fonte você recomenda para RTX 4070 Super?',
        'Ryzen 5 7600 vale a pena com DDR5?',
      ],
    };
  }

  // 5. Metodologia RevSafe / Imparcialidade
  if (q.includes('metodologia') || q.includes('imparcial') || q.includes('como funciona') || q.includes('nota') || q.includes('pilares')) {
    return {
      message: `A pontuação RevSafe é calculada sobre **4 pilares fundamentais**:\n\n` +
        `1. **Qualidade & Durabilidade (Peso base 25%):** Materiais empregados, resistência mecânica, longevidade estimada e índice de quebra.\n` +
        `2. **Segurança & Certificações (Peso base 25%):** Homologação Inmetro/Anatel, isolação térmica, proteção de dados e histórico de alertas/recalls.\n` +
        `3. **Sustentabilidade & Eficiência (Peso base 25%):** Consumo elétrico em Watts, índice de reparabilidade (iFixit/normas europeias) e reciclabilidade.\n` +
        `4. **Custo-Benefício & Valor Real (Peso base 25%):** Custo amortizado por ano de vida útil estimada, e não apenas o menor preço nominal na prateleira.\n\n` +
        `*Nota de Transparência: A RevSafe não aceita patrocínio de fabricantes para alteração de notas. Todas as informações demonstram o funcionamento da plataforma.*`,
      isSimulated: true,
      suggestedPrompts: [
        'Ver produtos com maior nota de segurança',
        'Ver produtos mais sustentáveis',
        'Como usar o recomendador personalizado?',
      ],
    };
  }

  // Resposta geral contextualizada com produtos em destaque
  const defaultPicks = MOCK_PRODUCTS.slice(0, 3);
  return {
    message: `Olá! Sou o Assistente Especialista da **RevSafe**. Posso ajudar você a analisar qualquer produto com base em critérios técnicos, cruzar especificações e encontrar a compra mais segura e durável para o seu bolso.\n\n` +
      `Você pode me perguntar coisas como:\n` +
      `• *"Compare o Galaxy S24 Ultra com o iPhone 15"* \n` +
      `• *"Qual a Air Fryer mais segura contra superaquecimento?"* \n` +
      `• *"Me indique um notebook durável até R$ 4.500"* \n` +
      `• *"Como escolher a fonte ideal para o meu PC?"* \n\n` +
      `O que você está pensando em comprar no momento?`,
    isSimulated: true,
    referencedProducts: defaultPicks,
    suggestedPrompts: [
      'Comparar smartphones topo de linha',
      'Verificar alertas de recall em eletrodomésticos',
      'Configuração de PC Gamer com boa eficiência',
    ],
  };
}
