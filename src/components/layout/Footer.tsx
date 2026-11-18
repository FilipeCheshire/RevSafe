import React from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { ShieldCheck, Scale, Info } from 'lucide-react';

interface FooterProps {
  onNavigateTab: (tab: 'home' | 'catalog' | 'compare' | 'recommendations' | 'pcbuilder' | 'chat') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-10">
          {/* Brand */}
          <div className="md:col-span-5 space-y-3">
            <button type="button" onClick={() => onNavigateTab('home')} aria-label="RevSafe — início" className="rounded-lg">
              <BrandLogo />
            </button>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Plataforma de curadoria e comparação imparcial de produtos. Avaliações com base em qualidade, segurança, sustentabilidade e custo-benefício.
            </p>
          </div>

          {/* Navegação */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Navegação
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigateTab('home')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('catalog')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Catálogo
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('compare')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Comparador
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('recommendations')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Recomendações
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('pcbuilder')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Monte seu PC
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('chat')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Chatbot
                </button>
              </li>
            </ul>
          </div>

          {/* Pilares */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Pilares de Avaliação
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-xs leading-relaxed">
              <li>• <b>Qualidade:</b> Durabilidade estrutural, materiais e resistência.</li>
              <li>• <b>Segurança:</b> Certificações oficiais, isolamento elétrico e histórico de falhas.</li>
              <li>• <b>Sustentabilidade:</b> Eficiência energética e facilidade de reparo.</li>
              <li>• <b>Custo-Benefício:</b> Relação entre custo e expectativa de vida útil.</li>
            </ul>
          </div>
        </div>

        {/* Informações Institucionais & Copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p className="max-w-2xl leading-relaxed">
            Plataforma independente de análise e comparação técnica de produtos. Dados e relatórios estruturados para orientar decisões de compra seguras.
          </p>

          <div className="shrink-0 text-center md:text-right">
            <div>© {new Date().getFullYear()} RevSafe. Todos os direitos reservados.</div>
          </div>
        </div>
      </div>
    </footer>
  );
};
