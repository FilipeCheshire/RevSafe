'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomeView } from './components/home/HomeView';
import { CatalogView } from './components/catalog/CatalogView';
import { CompareView } from './components/compare/CompareView';
import { RecommendationsView } from './components/recommendations/RecommendationsView';
import { PCBuilderView } from './components/pcbuilder/PCBuilderView';
import { ChatbotView } from './components/chat/ChatbotView';
import { ProductDetailModal } from './components/products/ProductDetailModal';
import { AuthModal } from './components/auth/AuthModal';
import { CompareFloatingBar } from './components/common/CompareFloatingBar';
import { Category, Product, UserProfile } from './types';
import { MOCK_PRODUCTS } from './data/mockProducts';
import { authService } from './services/authService';

export default function App() {
  const [currentTab, setCurrentTab] = useState<
    'home' | 'catalog' | 'compare' | 'recommendations' | 'pcbuilder' | 'chat'
  >('home');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [catalogInitialCategory, setCatalogInitialCategory] = useState<Category | 'all'>('all');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [chatInitialQuestion, setChatInitialQuestion] = useState<string | null>(null);

  // Modo Noturno com Tailwind e persistência
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    setUser(authService.getCurrentUser());
    setComparedIds(authService.getActiveComparisonIds());
    setFavoritesIds(authService.getFavorites());
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (!themeReady) return;
    document.documentElement.classList.toggle('dark', isDarkMode);
    try { localStorage.setItem('revsafe_theme', isDarkMode ? 'dark' : 'light'); } catch {}
  }, [isDarkMode, themeReady]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Estados persistentes de usuário, comparação e favoritos
  const [user, setUser] = useState<UserProfile | null>(null);
  const [comparedIds, setComparedIds] = useState<string[]>([]);
  const [favoritesIds, setFavoritesIds] = useState<string[]>([]);

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(authService.getCurrentUser());
      setFavoritesIds(authService.getFavorites());
    };

    const handleComparisonChange = () => {
      setComparedIds(authService.getActiveComparisonIds());
    };

    const handleFavoritesChange = () => {
      setFavoritesIds(authService.getFavorites());
    };

    window.addEventListener('revsafe_auth_change', handleAuthChange);
    window.addEventListener('revsafe_comparison_change', handleComparisonChange);
    window.addEventListener('revsafe_favorites_change', handleFavoritesChange);

    return () => {
      window.removeEventListener('revsafe_auth_change', handleAuthChange);
      window.removeEventListener('revsafe_comparison_change', handleComparisonChange);
      window.removeEventListener('revsafe_favorites_change', handleFavoritesChange);
    };
  }, []);

  const comparedProducts = comparedIds
    .map((id) => MOCK_PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => !!p);

  const handleOpenProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleToggleCompare = (product: Product) => {
    if (comparedIds.includes(product.id)) {
      authService.removeFromComparison(product.id);
    } else {
      authService.addToComparison(product.id);
    }
  };

  const handleToggleFavorite = (productId: string) => {
    authService.toggleFavorite(productId);
  };

  const handleSelectCategoryFromHome = (cat: Category) => {
    setCatalogSearch('');
    setCatalogInitialCategory(cat);
    setCurrentTab('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskChatbotAboutProduct = (productName: string) => {
    setChatInitialQuestion(productName);
    setCurrentTab('chat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateTab = (tab: any) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!themeReady) {
    return <div className="min-h-[100dvh] bg-slate-50 dark:bg-slate-950" role="status" aria-label="Carregando RevSafe" />;
  }

  if (!user) {
    return (
      <main className="relative min-h-[100dvh] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
        <button type="button" onClick={toggleDarkMode} aria-label="Alternar tema claro e escuro" className="absolute right-4 top-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-700 dark:text-slate-200">
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <AuthModal fullPage isOpen onClose={() => {}} onSuccess={() => {
          setCurrentTab('home');
          setUser(authService.getCurrentUser());
          window.scrollTo({ top: 0 });
        }} />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white transition-colors">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigateTab={handleNavigateTab}
        comparedCount={comparedIds.length}
        user={user}
        onOpenAuth={() => {}}
        onLogout={() => {
          authService.logout();
          setUser(null);
          setCurrentTab('home');
          setSelectedProduct(null);
          setIsDetailModalOpen(false);
          setChatInitialQuestion(null);
        }}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Content Router */}
      <a href="#main-content" className="skip-link">Pular para o conteúdo</a>
      <main id="main-content" className={`flex-1 min-w-0 ${comparedIds.length && currentTab !== 'compare' ? 'pb-44 sm:pb-28' : ''}`}>
        {currentTab === 'home' && (
          <HomeView
            onSearch={(query) => { setCatalogSearch(query); setCatalogInitialCategory('all'); handleNavigateTab('catalog'); }}
            onSelectCategory={handleSelectCategoryFromHome}
            onOpenProductDetail={handleOpenProductDetail}
            comparedIds={comparedIds}
            onToggleCompare={handleToggleCompare}
            favoritesIds={favoritesIds}
            onToggleFavorite={handleToggleFavorite}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {currentTab === 'catalog' && (
          <CatalogView
            onOpenProductDetail={handleOpenProductDetail}
            comparedIds={comparedIds}
            onToggleCompare={handleToggleCompare}
            favoritesIds={favoritesIds}
            onToggleFavorite={handleToggleFavorite}
            initialSearch={catalogSearch}
            initialCategory={catalogInitialCategory}
          />
        )}

        {currentTab === 'compare' && (
          <CompareView
            comparedProducts={comparedProducts}
            onRemoveProduct={(id) => authService.removeFromComparison(id)}
            onAddProduct={(p) => authService.addToComparison(p.id)}
            onClearAll={() => authService.clearComparison()}
            onOpenProductDetail={handleOpenProductDetail}
            onNavigateToCatalog={() => handleNavigateTab('catalog')}
          />
        )}

        {currentTab === 'recommendations' && (
          <RecommendationsView
            onOpenProductDetail={handleOpenProductDetail}
            onToggleCompare={handleToggleCompare}
            comparedIds={comparedIds}
          />
        )}

        {currentTab === 'pcbuilder' && <PCBuilderView />}

        {currentTab === 'chat' && (
          <ChatbotView
            onOpenProductDetail={handleOpenProductDetail}
            onToggleCompare={handleToggleCompare}
            comparedIds={comparedIds}
            initialQuestion={chatInitialQuestion}
            onClearInitialQuestion={() => setChatInitialQuestion(null)}
          />
        )}
      </main>

      {/* Floating Compare Bar */}
      {currentTab !== 'compare' && (
        <CompareFloatingBar
          products={comparedProducts}
          onRemove={(id) => authService.removeFromComparison(id)}
          onClear={() => authService.clearComparison()}
          onOpenCompare={() => handleNavigateTab('compare')}
        />
      )}

      {/* Modal de Detalhes do Produto */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        isCompared={selectedProduct ? comparedIds.includes(selectedProduct.id) : false}
        onToggleCompare={handleToggleCompare}
        isFavorite={selectedProduct ? favoritesIds.includes(selectedProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onAskChatbot={handleAskChatbotAboutProduct}
      />

      {/* Footer */}
      <Footer onNavigateTab={handleNavigateTab} />
    </div>
  );
}
