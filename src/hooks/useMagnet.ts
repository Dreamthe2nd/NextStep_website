import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Magnetic attraction (±6px) on desktop hover devices.
 * Respects `prefers-reduced-motion` and `(hover: none)`.
 */
export function useMagnet<T extends HTMLElement = HTMLButtonElement>(strength = 6) {
  const ref = useRef<T | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || typeof window === 'undefined') return;
    if (!window.matchMedia('(hover: hover)').matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `translate3d(${(relX * strength * 2).toFixed(2)}px, ${(
        relY *
        strength *
        2
      ).toFixed(2)}px, 0)`;
    };

    const onLeave = () => {
      el.style.transform = 'translate3d(0px, 0px, 0)';
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [reduced, strength]);

  return ref;
}
