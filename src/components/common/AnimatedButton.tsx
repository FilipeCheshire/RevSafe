import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  compact?: boolean;
}

const arrowPath = 'M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z';

export function AnimatedButton({ children, compact = false, className = '', type = 'button', ...props }: AnimatedButtonProps) {
  return (
    <button type={type} className={`animated-button ${compact ? 'animated-button--compact' : ''} ${className}`} {...props}>
      <svg aria-hidden="true" className="arr-2" viewBox="0 0 24 24"><path d={arrowPath} /></svg>
      <span className="text">{children}</span>
      <span aria-hidden="true" className="circle" />
      <svg aria-hidden="true" className="arr-1" viewBox="0 0 24 24"><path d={arrowPath} /></svg>
    </button>
  );
}
