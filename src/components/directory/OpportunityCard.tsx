import { ArrowUpRight, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';
import type { Opportunity } from '@/data/schema';
import { getDeadlineStatus } from '@/lib/date';
import { springPop } from '@/lib/motion';
import { useLenisScroll } from '@/hooks/useLenis';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import { DeadlineChip } from './DeadlineChip';

interface OpportunityCardProps {
  opp: Opportunity;
  index?: number;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  onOpenDetail: (opp: Opportunity) => void;
}

export function OpportunityCard({
  opp,
  index = 0,
  isSaved = false,
  onToggleSave,
  onOpenDetail,
}: OpportunityCardProps) {
  const { scrollTo } = useLenisScroll();
  const status = getDeadlineStatus(opp.deadlineISO);
  const isClosed = status.kind === 'closed';
  const isInternal = opp.url.startsWith('#');

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 48, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ ...springPop, delay: (index % 3) * 0.07 }}
      className="h-full"
    >
      <SpotlightCard
        spotlightColor="#93c5fd"
        intensity={0.12}
        spotlightSize={280}
        borderGlow={0.75}
        grain={0.07}
        className="group h-full flex flex-col justify-between rounded-2xl bg-[#121215]/78 backdrop-blur-md border border-white/[0.09] p-6"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] font-mono text-[11px] uppercase tracking-[0.08em] text-slate-200">
              <span className="text-slate-500 tabular-nums">{opp.indexLabel}</span>
              <span>{opp.category}</span>
            </span>

            <div className="flex items-center gap-2">
              <DeadlineChip deadlineLabel={opp.deadlineLabel} deadlineISO={opp.deadlineISO} />
              {onToggleSave && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.85 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  onClick={() => onToggleSave(opp.id)}
                  aria-label={
                    isSaved ? `Remove ${opp.title} from shortlist` : `Save ${opp.title} to shortlist`
                  }
                  aria-pressed={isSaved}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    isSaved
                      ? 'border-[#e6c98b]/50 bg-[#e6c98b]/15 text-[#e6c98b]'
                      : 'border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                </motion.button>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenDetail(opp)}
            className="text-left w-full cursor-pointer"
          >
            <h3 className="text-xl font-semibold text-white tracking-[-0.03em] group-hover:text-[#e6c98b] transition-colors">
              {opp.title}
            </h3>
          </button>

          <div className="mt-3 flex flex-wrap gap-2 font-mono text-[11px] text-slate-400">
            <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06]">
              {opp.targetClasses}
            </span>
            <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06]">
              {opp.format}
            </span>
            <span
              className={`px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] ${
                isClosed ? 'line-through text-slate-500' : 'text-slate-300'
              }`}
            >
              {opp.deadlineLabel}
            </span>
          </div>

          <p className="mt-4 text-sm text-slate-400 leading-relaxed">{opp.copy}</p>
        </div>

        <div className="relative z-10 mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-2">
          <motion.button
            type="button"
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpenDetail(opp)}
            className="font-mono text-[11px] uppercase tracking-[0.12em] text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Specs & checklist →
          </motion.button>

          {isInternal ? (
            <motion.button
              type="button"
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollTo('#team')}
              className="inline-flex items-center gap-1 text-xs font-medium text-white group-hover:text-[#e6c98b] transition-colors shrink-0 cursor-pointer"
            >
              <span>View opportunity</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </motion.button>
          ) : (
            <motion.a
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.95 }}
              href={opp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-white group-hover:text-[#e6c98b] transition-colors shrink-0"
            >
              <span>View opportunity</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </motion.a>
          )}
        </div>
      </SpotlightCard>
    </motion.article>
  );
}
