import React from 'react';
import { X } from 'lucide-react';
import { AnimatedButton } from '../common/AnimatedButton';
import { BrandLogo } from '../common/BrandLogo';
import { authService } from '../../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  fullPage?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, fullPage = false }) => {
  if (!isOpen) return null;

  const enterDemo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.currentTarget.reset();
    authService.loginDemoUser();
    onSuccess?.();
    onClose();
  };

  return (
    <div className={fullPage ? "flex min-h-[100dvh] items-center justify-center px-4 py-20 home-hero" : "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"}>
      <div role={fullPage ? "region" : "dialog"} aria-modal={fullPage ? undefined : true} aria-labelledby="demo-title" aria-describedby="demo-description" className="relative w-full max-w-md  bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="bg-slate-950 text-white p-6 relative">
          {!fullPage && <button onClick={onClose} title="Fechar" className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"><X className="w-4 h-4" /></button>}
          <BrandLogo className="mb-4" />
          <h2 id="demo-title" className="text-xl font-bold">Entrar na RevSafe</h2>
          <p className="mt-2 text-sm text-slate-300">Acesse seus favoritos com o perfil Filipe.</p>
        </div>
        <form onSubmit={enterDemo} className="p-6 space-y-5">
          <p id="demo-description" className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Acesso demonstrativo: use qualquer e-mail e senha para entrar como Filipe. Os dados digitados não são enviados nem salvos.</p>
          <div className="space-y-2">
            <label htmlFor="login-email" className="block text-sm font-semibold text-slate-900 dark:text-white">E-mail</label>
            <input id="login-email" type="email" required autoComplete="off" placeholder="seu@email.com" className="w-full min-w-0 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-base text-slate-900 dark:text-white" />
          </div>
          <div className="space-y-2">
            <label htmlFor="login-password" className="block text-sm font-semibold text-slate-900 dark:text-white">Senha</label>
            <input id="login-password" type="password" required autoComplete="off" placeholder="Digite qualquer senha" className="w-full min-w-0 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-base text-slate-900 dark:text-white" />
          </div>
          <AnimatedButton type="submit" className="w-full">Entrar</AnimatedButton>
          <p className="text-xs text-slate-600 dark:text-slate-400">O perfil fica salvo neste navegador até você sair.</p>
        </form>
      </div>
    </div>
  );
};
