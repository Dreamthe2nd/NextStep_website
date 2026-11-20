import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { registerGsap } from '@/lib/motion';

const LETTERS = ['N', 'E', 'X', 'T', 'S', 'T', 'E', 'P'];

export function KineticStarburst() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordmarkRef = useRef<HTMLDivElement | null>(null);
  const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reduced) return;
    registerGsap();

    const ctx = gsap.context(() => {
      if (wordmarkRef.current) {
        gsap.fromTo(
          wordmarkRef.current,
          { scale: 0.9, opacity: 0.2, letterSpacing: '0.18em' },
          {
            scale: 1,
            opacity: 1,
            letterSpacing: '-0.04em',
            ease: 'none',
            scrollTrigger: {
              trigger: container,
              start: 'top 92%',
              end: 'center 62%',
              scrub: 0.6,
            },
          }
        );
      }
    }, container);

    let mouseX = -9999;
    let mouseY = -9999;
    let rafId = 0;

    const update = () => {
      rafId = 0;
      const rect = container.getBoundingClientRect();
      const width = rect.width || 900;
      const approxY = rect.height * 0.52;

      letterRefs.current.forEach((el, idx) => {
        if (!el) return;
        const approxX = (width / (LETTERS.length + 1)) * (idx + 1);
        const dx = approxX - mouseX;
        const dy = approxY - mouseY;
        const dist = Math.hypot(dx, dy);
        const radius = 220;
        const force = dist < radius ? (1 - dist / radius) * 34 : 0;
        const tx = dist > 0 ? (dx / dist) * force : 0;
        const ty = dist > 0 ? (dy / dist) * force : 0;
        const rot = dist < radius ? ((idx % 2 === 0 ? 1 : -1) * force) / 2.2 : 0;
        el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(
          1
        )}px, 0) rotate(${rot.toFixed(1)}deg)`;
      });
    };

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      if (!rafId) rafId = requestAnimationFrame(update);
    };

    const onLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
      if (!rafId) rafId = requestAnimationFrame(update);
    };

    container.addEventListener('mousemove', onMove, { passive: true });
    container.addEventListener('mouseleave', onLeave);

    return () => {
      ctx.revert();
      if (rafId) cancelAnimationFrame(rafId);
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
    };
  }, [reduced]);

  return (
    <div
      ref={containerRef}
      aria-label="NextStep"
      className="relative max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28 flex flex-col items-center justify-center overflow-hidden select-none"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mx-auto max-w-2xl rounded-full blur-3xl opacity-55"
        style={{
          background:
            'radial-gradient(circle at 50% 55%, rgba(200,169,110,0.14) 0%, rgba(147,197,253,0.12) 45%, transparent 72%)',
        }}
      />
      <p className="relative text-[11px] font-mono uppercase tracking-[0.25em] text-zinc-500 mb-8">
        Move cursor across the mark
      </p>
      <div
        ref={wordmarkRef}
        aria-hidden="true"
        className="relative flex flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-8 will-change-transform"
      >
        {LETTERS.map((char, idx) => (
          <span
            key={`${char}-${idx}`}
            ref={(el) => {
              letterRefs.current[idx] = el;
            }}
            className="inline-block text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tighter text-zinc-950 transition-transform duration-150 ease-out cursor-default will-change-transform"
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}

export default KineticStarburst;
