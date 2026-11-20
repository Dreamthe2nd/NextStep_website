import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface MarginSpecimen {
  id: string;
  tag: string;
  threshold: number;
  side: 'left' | 'right';
}

const LEFT_STACK: MarginSpecimen[] = [
  { id: 'books', tag: '01 · READ', threshold: 0.05, side: 'left' },
  { id: 'play', tag: '02 · PLAY', threshold: 0.34, side: 'left' },
  { id: 'football', tag: '03 · SPORT', threshold: 0.64, side: 'left' },
];

const RIGHT_STACK: MarginSpecimen[] = [
  { id: 'flask', tag: '04 · LAB', threshold: 0.08, side: 'right' },
  { id: 'microscope', tag: '05 · OPTICS', threshold: 0.38, side: 'right' },
  { id: 'atom', tag: '06 · STEM', threshold: 0.68, side: 'right' },
];

function SpecimenSvg({ id, strokeOffset }: { id: string; strokeOffset: number }) {
  const dash = 260;
  const common = {
    stroke: '#d9b56d',
    strokeWidth: 1.35,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeDasharray: dash,
    strokeDashoffset: strokeOffset * dash,
    fill: 'none',
  };

  if (id === 'books') {
    return (
      <svg viewBox="0 0 40 40" className="w-7 h-7 shrink-0" aria-hidden="true">
        <path d="M8 29h24v4H8zM10 23h20v6H10z" {...common} />
        <path d="M8 10c4-2 8-1 12 1 4-2 8-3 12-1v11c-4-2-8-1-12 1-4-2-8-3-12-1V10z" {...common} />
        <path d="M20 11v11" {...common} />
      </svg>
    );
  }
  if (id === 'play') {
    return (
      <svg viewBox="0 0 40 40" className="w-7 h-7 shrink-0" aria-hidden="true">
        {/* Origami paper plane + spinning top toy */}
        <path d="M6 15L34 8L24 27L19 19L6 15Z" {...common} />
        <path d="M19 19L34 8" {...common} />
        <path d="M13 28h14l-7 8z" {...common} />
      </svg>
    );
  }
  if (id === 'football') {
    return (
      <svg viewBox="0 0 40 40" className="w-7 h-7 shrink-0" aria-hidden="true">
        <circle cx="20" cy="20" r="13" {...common} />
        <polygon points="20,13 26,18 24,25 16,25 14,18" {...common} />
        <path d="M20 7v6M31 15l-5 3M28 30l-4-5M12 30l4-5M9 15l5 3" {...common} />
      </svg>
    );
  }
  if (id === 'flask') {
    return (
      <svg viewBox="0 0 40 40" className="w-7 h-7 shrink-0" aria-hidden="true">
        <path d="M16 7h8M17 7v9l-8 14a3 3 0 002.6 4.5h16.8A3 3 0 0031 30l-8-14V7" {...common} />
        <path d="M13 25c3-2 11 2 14 0" {...common} />
        <circle cx="21" cy="20" r="1.3" {...common} />
      </svg>
    );
  }
  if (id === 'microscope') {
    return (
      <svg viewBox="0 0 40 40" className="w-7 h-7 shrink-0" aria-hidden="true">
        <path d="M10 33h20M14 29h12M20 9l-5 10 4 2 5-10zM23 13c5 2 6 9 1 16" {...common} />
        <path d="M12 24h9" {...common} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 40 40" className="w-7 h-7 shrink-0" aria-hidden="true">
      <ellipse cx="20" cy="20" rx="14" ry="5.5" transform="rotate(30 20 20)" {...common} />
      <ellipse cx="20" cy="20" rx="14" ry="5.5" transform="rotate(-30 20 20)" {...common} />
      <ellipse cx="20" cy="20" rx="5.5" ry="14" {...common} />
      <circle cx="20" cy="20" r="2.2" {...common} />
    </svg>
  );
}

export function GoldMarginElements() {
  const reduced = useReducedMotion();
  const [scrollMeta, setScrollMeta] = useState({ progress: 0, alpha: 0 });

  useEffect(() => {
    let rafId = 0;
    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

    const update = () => {
      const opp = document.getElementById('opportunities');
      const about = document.getElementById('about');
      if (!opp || !about) return;

      const vh = window.innerHeight;
      const oppTop = opp.getBoundingClientRect().top;
      const aboutTop = about.getBoundingClientRect().top;

      // Scrubbed envelope: fades in at Directory, fades cleanly out before #about curtain rises
      const enterAlpha = clamp((vh * 0.9 - oppTop) / (vh * 0.3), 0, 1);
      const exitAlpha = clamp((aboutTop - vh * 0.72) / (vh * 0.24), 0, 1);
      const alpha = enterAlpha * exitAlpha;

      const span = Math.max(1, aboutTop - oppTop);
      const passed = Math.max(0, vh * 0.72 - oppTop);
      const progress = clamp(passed / span, 0, 1);

      setScrollMeta((prev) =>
        Math.abs(prev.progress - progress) > 0.002 || Math.abs(prev.alpha - alpha) > 0.01
          ? { progress, alpha }
          : prev
      );
    };

    const onScrollOrFrame = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScrollOrFrame, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScrollOrFrame);
      window.removeEventListener('resize', update);
    };
  }, []);

  if (reduced) return null;

  const renderColumn = (items: MarginSpecimen[], alignClass: string, caption: string) => (
    <div
      style={{
        opacity: scrollMeta.alpha,
        visibility: scrollMeta.alpha > 0.01 ? 'visible' : 'hidden',
      }}
      className={`fixed bottom-12 ${alignClass} z-[12] hidden xl:flex flex-col-reverse items-center gap-3 pointer-events-none`}
      aria-hidden="true"
    >
      <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-[#d9b56d]/70 [writing-mode:vertical-rl] rotate-180 mb-1">
        {caption}
      </span>
      <div className="w-px h-10 bg-gradient-to-t from-[#d9b56d]/50 to-transparent" />
      {items.map((item) => {
        const local = Math.max(0, Math.min(1, (scrollMeta.progress - item.threshold) / 0.2));
        const isActive = local > 0.05;
        return (
          <div
            key={item.id}
            style={{
              opacity: isActive ? 0.4 + local * 0.6 : 0,
              transform: `translate3d(0, ${((1 - local) * 18).toFixed(1)}px, 0) scale(${(
                0.9 +
                local * 0.1
              ).toFixed(3)})`,
            }}
            className="w-[76px] h-[76px] p-2.5 rounded-lg border border-[#d9b56d]/30 bg-[#09090b]/88 backdrop-blur-sm flex flex-col items-center justify-center gap-1.5 shadow-[0_6px_22px_rgba(0,0,0,0.65)] transition-transform duration-200 ease-out"
          >
            <SpecimenSvg id={item.id} strokeOffset={1 - local} />
            <span className="font-mono text-[7px] leading-none tracking-[0.02em] text-[#d9b56d]/90 whitespace-nowrap">
              {item.tag}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {renderColumn(LEFT_STACK, 'left-3', 'BOOKS · PLAY · SPORT')}
      {renderColumn(RIGHT_STACK, 'right-3', 'LAB · OPTICS · STEM')}
    </>
  );
}
