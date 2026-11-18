import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface PreviewPayload {
  title: string;
  meta: string;
  tag?: string;
}

interface CursorPreviewContextValue {
  showPreview: (payload: PreviewPayload) => void;
  hidePreview: () => void;
}

const CursorPreviewContext = createContext<CursorPreviewContextValue>({
  showPreview: () => {},
  hidePreview: () => {},
});

export function CursorPreviewProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [canHover, setCanHover] = useState(false);
  const [payload, setPayload] = useState<PreviewPayload | null>(null);

  const rawX = useMotionValue(-999);
  const rawY = useMotionValue(-999);
  const x = useSpring(rawX, { stiffness: 420, damping: 32, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 420, damping: 32, mass: 0.5 });

  useEffect(() => {
    if (typeof window === 'undefined' || reduced) {
      setCanHover(false);
      return;
    }
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [reduced]);

  useEffect(() => {
    if (!canHover) return;
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX + 18);
      rawY.set(e.clientY + 18);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [canHover, rawX, rawY]);

  const showPreview = useCallback(
    (next: PreviewPayload) => {
      if (canHover) setPayload(next);
    },
    [canHover]
  );

  const hidePreview = useCallback(() => setPayload(null), []);

  return (
    <CursorPreviewContext.Provider value={{ showPreview, hidePreview }}>
      {children}
      {canHover && payload && (
        <motion.div
          style={{ x, y }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.14 }}
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-[65] max-w-[240px] rounded-xl border border-white/15 bg-[#0c0c0e]/95 backdrop-blur-md px-3.5 py-2.5 shadow-2xl"
        >
          {payload.tag && (
            <p className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
              {payload.tag}
            </p>
          )}
          <p className="text-xs font-semibold text-white truncate mt-0.5">{payload.title}</p>
          <p className="text-[11px] font-mono text-zinc-400 mt-0.5">{payload.meta}</p>
        </motion.div>
      )}
    </CursorPreviewContext.Provider>
  );
}

export const useCursorPreview = () => useContext(CursorPreviewContext);
