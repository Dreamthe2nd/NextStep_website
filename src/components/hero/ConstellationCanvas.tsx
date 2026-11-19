import { useEffect, useMemo, useRef } from 'react';
import type { Opportunity } from '@/data/schema';
import { getSharedStars } from '@/lib/stars';
import { getDeadlineStatus, sortByStatus, statusLabel } from '@/lib/date';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useCursorPreview } from '@/hooks/useCursorPreview';

interface ConstellationCanvasProps {
  opportunities: Opportunity[];
  /** 0..1 scroll progress driving stars converging into the overhead spotlight */
  convergeProgress?: number;
  onSelectOpportunity: (opp: Opportunity) => void;
}

interface OppStar {
  opp: Opportunity;
  nx: number;
  ny: number;
}

function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function ConstellationCanvas({
  opportunities,
  convergeProgress = 0,
  onSelectOpportunity,
}: ConstellationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef(convergeProgress);

  useEffect(() => {
    progressRef.current = convergeProgress;
  }, [convergeProgress]);

  const reduced = useReducedMotion();
  const { showPreview, hidePreview } = useCursorPreview();

  const oppStars = useMemo<OppStar[]>(() => {
    const anchors = [
      { nx: 0.12, ny: 0.24 },
      { nx: 0.87, ny: 0.22 },
      { nx: 0.08, ny: 0.48 },
      { nx: 0.91, ny: 0.46 },
      { nx: 0.18, ny: 0.65 },
      { nx: 0.82, ny: 0.64 },
    ];
    return sortByStatus(opportunities)
      .slice(0, 6)
      .map((opp, idx) => {
        const base = anchors[idx % anchors.length];
        const h = hashSeed(opp.id);
        const jx = ((h % 100) / 100 - 0.5) * 0.04;
        const jy = (((h >> 8) % 100) / 100 - 0.5) * 0.04;
        return { opp, nx: base.nx + jx, ny: base.ny + jy };
      });
  }, [opportunities]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let visible = true;
    let tabVisible = !document.hidden;
    let hoveredIndex = -1;
    let width = 0;
    let height = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    const onVis = () => {
      tabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVis);

    const ambient = getSharedStars(150);

    const getOppCoords = (s: OppStar, p: number) => {
      const targetX = width * 0.5;
      const targetY = height * 0.2;
      const x = s.nx * width + (targetX - s.nx * width) * p * 0.62;
      const y = s.ny * height + (targetY - s.ny * height) * p * 0.62;
      return { x, y };
    };

    const draw = () => {
      if (visible && tabVisible && width > 0 && height > 0) {
        ctx.clearRect(0, 0, width, height);
        const p = reduced ? 0 : progressRef.current;

        ambient.forEach((s, idx) => {
          if (!reduced) s.phase += s.speed;
          const alpha = reduced ? 0.35 : 0.2 + 0.65 * (0.5 + 0.5 * Math.sin(s.phase));
          const sx = s.nx * width + (width * 0.5 - s.nx * width) * p * 0.35;
          const sy = s.ny * height + (height * 0.22 - s.ny * height) * p * 0.35;
          ctx.beginPath();
          ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
          ctx.fillStyle =
            idx % 7 === 0
              ? `rgba(230, 201, 139, ${alpha.toFixed(3)})`
              : idx % 2 === 0
              ? `rgba(147, 197, 253, ${alpha.toFixed(3)})`
              : `rgba(224, 242, 254, ${alpha.toFixed(3)})`;
          ctx.fill();
        });

        if (hoveredIndex >= 0) {
          const active = oppStars[hoveredIndex];
          const aPos = getOppCoords(active, p);
          oppStars.forEach((other, idx) => {
            if (idx === hoveredIndex) return;
            if (other.opp.filterGroup === active.opp.filterGroup) {
              const bPos = getOppCoords(other, p);
              ctx.beginPath();
              ctx.moveTo(aPos.x, aPos.y);
              ctx.lineTo(bPos.x, bPos.y);
              ctx.strokeStyle = 'rgba(96, 165, 250, 0.48)';
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          });
        }

        oppStars.forEach((s, idx) => {
          const { x, y } = getOppCoords(s, p);
          const isHov = idx === hoveredIndex;
          const radius = isHov ? 5.2 : 3.2;

          ctx.beginPath();
          ctx.arc(x, y, radius * 3.4, 0, Math.PI * 2);
          ctx.fillStyle = isHov ? 'rgba(96, 165, 250, 0.32)' : 'rgba(96, 165, 250, 0.14)';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = isHov ? '#e0f2fe' : '#60a5fa';
          ctx.fill();
        });
      }

      if (!reduced) {
        animId = requestAnimationFrame(draw);
      }
    };

    draw();

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const p = reduced ? 0 : progressRef.current;

      let found = -1;
      for (let i = 0; i < oppStars.length; i++) {
        const { x, y } = getOppCoords(oppStars[i], p);
        if (Math.hypot(mx - x, my - y) <= 24) {
          found = i;
          break;
        }
      }

      if (found !== hoveredIndex) {
        hoveredIndex = found;
        canvas.style.cursor = found >= 0 ? 'pointer' : 'default';
        if (found >= 0) {
          const opp = oppStars[found].opp;
          showPreview({
            tag: opp.category,
            title: opp.title,
            meta: `${opp.deadlineLabel} · ${statusLabel(getDeadlineStatus(opp.deadlineISO))}`,
          });
        } else {
          hidePreview();
        }
        if (reduced) draw();
      }
    };

    const onLeave = () => {
      hoveredIndex = -1;
      canvas.style.cursor = 'default';
      hidePreview();
      if (reduced) draw();
    };

    const onClick = () => {
      if (hoveredIndex >= 0) {
        onSelectOpportunity(oppStars[hoveredIndex].opp);
      }
    };

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      canvas.removeEventListener('click', onClick);
      hidePreview();
    };
  }, [oppStars, reduced, showPreview, hidePreview, onSelectOpportunity]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="hidden sm:block absolute inset-0 w-full h-full z-[1]"
      />
      <ul className="sr-only" aria-label="Featured opportunity constellation">
        {opportunities.map((opp) => (
          <li key={opp.id}>
            <button type="button" onClick={() => onSelectOpportunity(opp)}>
              {opp.title} — {opp.deadlineLabel}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
