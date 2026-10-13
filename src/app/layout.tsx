import type { Metadata, Viewport } from 'next';
import '../index.css';

export const metadata: Metadata = {
  title: 'RevSafe | Escolhas melhores, com confiança',
  description: 'Compare produtos por qualidade, segurança, sustentabilidade e custo-benefício.',
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: `try { const theme = localStorage.getItem('revsafe_theme'); document.documentElement.classList.toggle('dark', theme ? theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches); } catch {}` }} /></head>
      <body>{children}</body>
    </html>
  );
}
