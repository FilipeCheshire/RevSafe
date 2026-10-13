import React from 'react';
import { X } from 'lucide-react';
import { AnimatedButton } from '../common/AnimatedButton';
import { BrandLogo } from '../common/BrandLogo';
import { authService } from '../../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  const enterDemo = () => {
    authService.loginDemoUser();
    onSuccess?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div role="dialog" aria-modal="true" aria-labelledby="demo-title" aria-describedby="demo-description" className="relative w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="bg-slate-950 text-white p-6 relative">
          <button onClick={onClose} title="Fechar" className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"><X className="w-4 h-4" /></button>
          <BrandLogo className="mb-4" />
          <h2 id="demo-title" className="text-xl font-bold">Experimente a RevSafe</h2>
          <p className="mt-2 text-sm text-slate-300">Explore seus favoritos com um perfil de exemplo.</p>
        </div>
        <div className="p-6 space-y-5">
          <p id="demo-description" className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Este é um acesso demonstrativo, sem cadastro ou autenticação real. Não pedimos e-mail nem senha. O perfil e os favoritos são salvos somente neste navegador.</p>
          <AnimatedButton onClick={enterDemo} className="w-full">Usar perfil demonstrativo</AnimatedButton>
          <p className="text-xs text-slate-600 dark:text-slate-400">Ao sair, a sessão demonstrativa é removida deste dispositivo.</p>
        </div>
      </div>
    </div>
  );
};
