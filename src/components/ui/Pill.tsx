import { useCallback, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/cn';
import { useMagnet } from '@/hooks/useMagnet';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface PillProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  magnetic?: boolean;
}

export function Pill({
  children,
  variant = 'outline',
  magnetic = true,
  className,
  onClick,
  ...rest
}: PillProps) {
  const magnetRef = useMagnet<HTMLButtonElement>(magnetic ? 5 : 0);
  const reduced = useReducedMotion();
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (!reduced) {
        const rect = e.currentTarget.getBoundingClientRect();
        const id = ++nextId.current;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setRipples((prev) => [...prev.slice(-3), { id, x, y }]);
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 620);
      }
      onClick?.(e);
    },
    [onClick, reduced]
  );

  return (
    <motion.button
      ref={magnetic ? magnetRef : undefined}
      whileHover={reduced ? undefined : { y: -1.5, scale: 1.025 }}
      whileTap={reduced ? undefined : { scale: 0.955 }}
      transition={{ type: 'spring', stiffness: 480, damping: 24 }}
      onClick={handleClick}
      className={cn(
        'relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-full text-xs font-medium transition-colors duration-200 cursor-pointer select-none',
        variant === 'primary' &&
          'bg-white text-[#03060c] hover:bg-[#f3ecd8] shadow-[0_0_28px_rgba(230,201,139,0.18)]',
        variant === 'outline' &&
          'border border-[var(--hairline)] bg-white/[0.04] text-white hover:bg-white/[0.09] hover:border-white/25',
        variant === 'ghost' && 'text-zinc-400 hover:text-white',
        className
      )}
      {...rest}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden="true"
          style={{ left: r.x, top: r.y, width: 90, height: 90 }}
          className={`ns-ripple ${
            variant === 'primary' ? 'bg-black/15' : 'bg-[#e6c98b]/30'
          }`}
        />
      ))}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
