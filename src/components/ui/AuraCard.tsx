import type { MouseEvent, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface AuraCardProps {
  children: ReactNode;
  className?: string;
}

export function AuraCard({ children, className }: AuraCardProps) {
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <div onMouseMove={onMove} className={cn('aura-card', className)}>
      {children}
    </div>
  );
}
