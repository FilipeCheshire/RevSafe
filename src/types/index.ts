export type Category = 
  | 'smartphones' 
  | 'notebooks' 
  | 'eletrodomesticos' 
  | 'audio' 
  | 'monitores' 
  | 'hardware';

export interface PillarScores {
  quality: number;        // 0 to 10 - Durabilidade, materiais, acabamento
  safety: number;         // 0 to 10 - Certificações oficiais, testes elétricos/térmicos, privacidade
  sustainability: number; // 0 to 10 - Eficiência energética, reparabilidade, embalagem
  costBenefit: number;    // 0 to 10 - Relação custo por ano de vida útil, preço justo
  overall: number;        // Média ponderada calculada
}

export interface PillarNotes {
  quality: string;
  safety: string;
  sustainability: string;
  costBenefit: string;
}

export interface SafetyAlert {
  hasAlert: boolean;
  severity: 'none' | 'info' | 'warning' | 'recall';
  title: string;
  description: string;
  date?: string;
  affectedBatches?: string;
  status: 'resolvido' | 'em_analise' | 'alerta_ativo' | 'sem_historico';
  isSimulated: boolean;
}

export interface ProductSource {
  title: string;
  organization: string;
  type: 'Laboratório' | 'Certificadora' | 'Relatório Técnico' | 'Regulatório' | 'Desmontagem';
  urlLabel: string;
  date: string;
  isSimulated: boolean;
}

export interface PriceQuote {
  storeName: string;
  price: number;
  available: boolean;
  isLowestPrice?: boolean;
  storeUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: 'Escolha Imparcial' | 'Melhor Custo-Benefício' | 'Líder em Segurança' | 'Sustentabilidade Top' | 'Sob Análise';
  summary: string;
  scores: PillarScores;
  pillarNotes: PillarNotes;
  specs: Record<string, string>;
  specificationSource?: { title: string; url: string };
  pros: string[];
  cons: string[];
  safetyAlert: SafetyAlert;
  sources: ProductSource[];
  priceQuotes?: PriceQuote[];
  certifications: string[]; // ex: ['Inmetro A+', 'Anatel Aprovado', 'Energy Star', 'CE']
  reparabilityIndex: number; // 1 a 10
  energyClass?: 'A+++' | 'A++' | 'A+' | 'A' | 'B' | 'C' | 'N/A';
  isSimulated: boolean;
  createdAt: string;
}

export type PCPartType = 'cpu' | 'motherboard' | 'ram' | 'gpu' | 'storage' | 'psu' | 'case' | 'monitor';

export interface PCComponent {
  id: string;
  type: PCPartType;
  typeLabel: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  socket?: 'AM5' | 'AM4' | 'LGA1700' | 'LGA1851';
  supportedSockets?: ('AM5' | 'AM4' | 'LGA1700' | 'LGA1851')[];
  ramType?: 'DDR4' | 'DDR5';
  supportedRamType?: 'DDR4' | 'DDR5';
  tdpWatts: number;
  memorySlots?: number;
  storageSlots?: number;
  ramModules?: number;
  recommendedPsuWattage?: number;
  wattage?: number; // Para PSU
  efficiencyRating?: string; // ex: '80 Plus Gold'
  formFactor?: 'ATX' | 'Micro-ATX' | 'Mini-ITX';
  specs: Record<string, string>;
  specificationSource?: { title: string; url: string };
  scores: {
    quality: number;
    safety: number;
    sustainability: number;
    costBenefit: number;
    overall: number;
  };
  pros: string[];
  cons: string[];
  priceQuotes?: PriceQuote[];
  isSimulated: boolean;
}

export interface PCBuildState {
  cpu: PCComponent | null;
  motherboard: PCComponent | null;
  ram: PCComponent[];
  gpu: PCComponent[];
  storage: PCComponent[];
  monitor: PCComponent[];
  psu: PCComponent | null;
  case: PCComponent | null;
  targetBudget: number;
  targetPurpose: 'gaming' | 'work' | 'general';
}

export interface CompatibilityIssue {
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  componentA?: string;
  componentB?: string;
  recommendation?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  savedFavorites: string[]; // product IDs
  savedComparisons: string[][]; // arrays of product IDs
  preferences: {
    prioritizeEco: boolean;
    prioritizeSafety: boolean;
    notifyRecalls: boolean;
  };
}

export interface RecommendationPreferences {
  category: Category | 'all';
  budgetMax: number;
  purpose: string;
  weights: {
    quality: number;
    safety: number;
    sustainability: number;
    costBenefit: number;
  };
  requireEcoCert: boolean;
  requireNoAlerts: boolean;
}

export interface RecommendationItem {
  product: Product;
  matchScore: number; // 0 to 100
  reasons: string[];
  tradeoffs: string[];
  tag: 'Melhor Compatibilidade' | 'Alternativa Econômica' | 'Escolha Premium' | 'Foco Sustentável';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isSimulated?: boolean;
  suggestedPrompts?: string[];
  referencedProducts?: Product[];
}
