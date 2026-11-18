import { useEffect, useMemo, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import type { Opportunity } from '@/data/schema';
import { getDeadlineStatus, sortByStatus, statusLabel } from '@/lib/date';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import SplitFlapText from '@/components/reactbits/SplitFlapText';

interface DepartureBoardProps {
  opportunities: Opportunity[];
  onSelectOpportunity: (opp: Opportunity) => void;
}

export function DepartureBoard({ opportunities, onSelectOpportunity }: DepartureBoardProps) {
  const reduced = useReducedMotion();
  const sorted = useMemo(() => sortByStatus(opportunities), [opportunities]);
  const [offset, setOffset] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduced || paused || sorted.length <= 1) return;
    const id = setInterval(() => {
      setOffset((prev) => (prev + 1) % sorted.length);
    }, 3500);
    return () => clearInterval(id);
  }, [reduced, paused, sorted.length]);

  const visibleRows = useMemo(() => {
    const count = Math.min(3, sorted.length);
    return Array.from({ length: count }, (_, i) => sorted[(offset + i) % sorted.length]);
  }, [sorted, offset]);

  const flapWords = useMemo(
    () => sorted.map((o) => o.category.toUpperCase().slice(0, 14)),
    [sorted]
  );

  return (
    <div className="border border-white/[0.09] bg-[#121215]/78 backdrop-blur-md overflow-hidden text-left">
      <div className="px-4 py-2.5 border-b border-white/[0.08] flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#93c5fd]" aria-hidden="true" />
          <span>Live Opportunity Board</span>
          <span className="hidden sm:inline-flex items-center pl-2 border-l border-white/[0.08]">
            <SplitFlapText
              words={flapWords}
              tileStyle="minimal"
              fontSize="11px"
              textColor="#93c5fd"
              gap="1px"
              cycleDelay={3500}
              loop={!paused && !reduced}
              padTo={14}
            />
          </span>
        </div>
        {!reduced && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Resume departure board' : 'Pause departure board'}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-white/[0.08] text-slate-300 hover:text-white hover:border-white/25 active:scale-95 transition-all cursor-pointer"
          >
            {paused ? <Play className="w-2.5 h-2.5" /> : <Pause className="w-2.5 h-2.5" />}
            <span>{paused ? 'Resume' : 'Pause'}</span>
          </button>
        )}
      </div>

      <div className="divide-y divide-white/[0.08]">
        <div className="hidden sm:grid grid-cols-12 gap-3 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
          <span className="col-span-5">Opportunity</span>
          <span className="col-span-3">Classes</span>
          <span className="col-span-2">Deadline</span>
          <span className="col-span-2 text-right">Status</span>
        </div>

        {visibleRows.map((opp) => {
          const st = getDeadlineStatus(opp.deadlineISO);
          const isClosed = st.kind === 'closed';
          return (
            <button
              key={opp.id}
              type="button"
              onClick={() => onSelectOpportunity(opp)}
              className="w-full grid grid-cols-2 sm:grid-cols-12 gap-2 sm:gap-3 px-4 py-3 text-xs items-center hover:bg-white/[0.03] transition-colors text-left cursor-pointer"
            >
              <span className="col-span-1 sm:col-span-5 font-medium tracking-[-0.01em] text-white truncate">
                {opp.title}
              </span>
              <span className="hidden sm:block sm:col-span-3 font-mono text-[11px] text-zinc-400 truncate">
                {opp.targetClasses}
              </span>
              <span
                className={`hidden sm:block sm:col-span-2 font-mono text-[11px] ${
                  isClosed ? 'line-through text-zinc-500' : 'text-zinc-300'
                }`}
              >
                {opp.deadlineLabel}
              </span>
              <span
                className={`col-span-1 sm:col-span-2 text-right font-mono text-[11px] ${
                  st.kind === 'rolling' || st.kind === 'open'
                    ? 'text-emerald-300'
                    : st.kind === 'closing-soon'
                    ? 'text-amber-300'
                    : 'text-zinc-500'
                }`}
              >
                {statusLabel(st)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
