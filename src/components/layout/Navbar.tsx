import React, { useState } from 'react';
import { Sun, Moon, Menu, X, LogOut, User } from 'lucide-react';
import { AnimatedButton } from '../common/AnimatedButton';
import { BrandLogo } from '../common/BrandLogo';
import { UserProfile } from '../../types';

interface NavbarProps {
  currentTab: 'home' | 'catalog' | 'compare' | 'recommendations' | 'pcbuilder' | 'chat';
  onNavigateTab: (tab: 'home' | 'catalog' | 'compare' | 'recommendations' | 'pcbuilder' | 'chat') => void;
  comparedCount: number;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigateTab,
  comparedCount,
  user,
  onOpenAuth,
  onLogout,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Início' },
    { id: 'catalog', label: 'Catálogo' },
    { id: 'compare', label: 'Comparador', badge: comparedCount > 0 ? comparedCount : null },
    { id: 'recommendations', label: 'Recomendações' },
    { id: 'pcbuilder', label: 'Monte seu PC' },
    { id: 'chat', label: 'Chatbot' },
  ];

  const handleTabClick = (tab: any) => {
    onNavigateTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-1 sm:gap-2 h-16">
          {/* Mobile menu comes before the brand */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              title="Menu"
              aria-label="Abrir menu de navegação"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          <button
            type="button"
            onClick={() => handleTabClick('home')}
            aria-label="RevSafe — início"
            className="shrink-0 rounded-lg select-none mr-auto xl:mr-0"
          >
            <BrandLogo className="max-[380px]:px-1.5 max-[380px]:[&_img]:w-24" />
          </button>

          {/* Desktop Navigation Links - Apenas nomes em texto sem ícones */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full bg-brand-action text-white text-[11px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Modo Noturno & Auth */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
              title={isDarkMode ? 'Mudar para tema claro' : 'Mudar para modo noturno'}
              aria-label="Alternar tema claro e escuro"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Auth State Button */}
            {user ? (
              <div className="flex items-center gap-1.5 pl-1">
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-medium text-slate-800 dark:text-slate-200 hidden sm:inline max-w-[120px] truncate">
                    {user.name}
                  </span>
                </div>

                <button
                  onClick={onLogout}
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <AnimatedButton compact className="max-[380px]:px-6" onClick={onOpenAuth}>Entrar</AnimatedButton>
            )}


          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer - Apenas texto */}
      {isMobileMenuOpen && (
        <nav id="mobile-navigation" aria-label="Navegação principal" className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full py-2.5 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-brand-action text-white text-xs font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
};
