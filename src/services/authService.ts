import { UserProfile } from '../types';

const STORAGE_KEY_USER = 'revsafe_user_session';
const STORAGE_KEY_COMPARISON = 'revsafe_active_comparison';
const safeIds = (value: unknown, limit = 100): string[] => Array.isArray(value)
  ? [...new Set(value.filter((id): id is string => typeof id === 'string' && /^prod-[a-z]{2}-[0-9]{2}$/.test(id)))].slice(0, limit)
  : [];

const DEFAULT_DEMO_USER: UserProfile = {
  id: 'usr-demo-01',
  name: 'Mariana Duarte',
  email: 'mariana.duarte@exemplo.com.br',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  savedFavorites: ['prod-sp-01', 'prod-el-01', 'prod-nb-01'],
  savedComparisons: [['prod-sp-01', 'prod-sp-02']],
  preferences: {
    prioritizeEco: true,
    prioritizeSafety: true,
    notifyRecalls: true,
  },
};

export const authService = {
  getCurrentUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USER);
      if (data) {
        const stored = JSON.parse(data);
        if (stored && stored.id === DEFAULT_DEMO_USER.id) return { ...DEFAULT_DEMO_USER, savedFavorites: safeIds(stored.savedFavorites) };
      }
    } catch {
      // LocalStorage error fallback
    }
    return null;
  },

  loginDemoUser(): UserProfile {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(DEFAULT_DEMO_USER));
    window.dispatchEvent(new Event('revsafe_auth_change'));
    return DEFAULT_DEMO_USER;
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEY_USER);
    window.dispatchEvent(new Event('revsafe_auth_change'));
  },

  toggleFavorite(productId: string): string[] {
    const user = this.getCurrentUser();
    if (!user) {
      // Se não autenticado, armazena favoritos anônimos temporários
      const anonFavs = this.getAnonymousFavorites();
      const next = anonFavs.includes(productId)
        ? anonFavs.filter((id) => id !== productId)
        : [...anonFavs, productId];
      localStorage.setItem('revsafe_anon_favs', JSON.stringify(next));
      window.dispatchEvent(new Event('revsafe_favorites_change'));
      return next;
    }

    const currentFavs = user.savedFavorites || [];
    const updated = currentFavs.includes(productId)
      ? currentFavs.filter((id) => id !== productId)
      : [...currentFavs, productId];

    user.savedFavorites = updated;
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    window.dispatchEvent(new Event('revsafe_favorites_change'));
    return updated;
  },

  getFavorites(): string[] {
    const user = this.getCurrentUser();
    if (user) return user.savedFavorites || [];
    return this.getAnonymousFavorites();
  },

  getAnonymousFavorites(): string[] {
    try {
      const data = localStorage.getItem('revsafe_anon_favs');
      return data ? safeIds(JSON.parse(data)) : [];
    } catch {
      return [];
    }
  },

  getActiveComparisonIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_COMPARISON);
      return data ? safeIds(JSON.parse(data), 4) : [];
    } catch {
      return [];
    }
  },

  setActiveComparisonIds(ids: string[]): void {
    localStorage.setItem(STORAGE_KEY_COMPARISON, JSON.stringify(safeIds(ids, 4)));
    window.dispatchEvent(new Event('revsafe_comparison_change'));
  },

  addToComparison(productId: string): boolean {
    const current = this.getActiveComparisonIds();
    if (current.includes(productId)) return false;
    if (current.length >= 4) return false; // limite máximo de 4 produtos
    const next = [...current, productId];
    this.setActiveComparisonIds(next);
    return true;
  },

  removeFromComparison(productId: string): void {
    const current = this.getActiveComparisonIds();
    const next = current.filter((id) => id !== productId);
    this.setActiveComparisonIds(next);
  },

  clearComparison(): void {
    this.setActiveComparisonIds([]);
  },
};
