import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerGsap } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface LenisContextValue {
  scrollTo: (target: string | HTMLElement | number, offset?: number) => void;
}

const LenisContext = createContext<LenisContextValue>({
  scrollTo: (target) => {
    if (typeof target === 'string') {
      document.querySelector(target)?.scrollIntoView({ behavior: 'auto' });
    }
  },
});

export function LenisProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    registerGsap();
    if (reduced) return;

    const lenis = new Lenis({ lerp: 0.1 });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  const scrollTo = useCallback(
    (target: string | HTMLElement | number, offset = -64) => {
      const lenis = lenisRef.current;
      if (lenis && !reduced) {
        lenis.scrollTo(target, { offset });
        return;
      }
      if (typeof target === 'string') {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
      } else if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' });
      } else {
        target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
      }
    },
    [reduced]
  );

  return <LenisContext.Provider value={{ scrollTo }}>{children}</LenisContext.Provider>;
}

export const useLenisScroll = () => useContext(LenisContext);
