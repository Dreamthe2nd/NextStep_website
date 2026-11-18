import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Bookmark,
  Calendar,
  Check,
  Sparkles,
  Share2,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { Opportunity } from '@/data/schema';
import { getDeadlineStatus, isOpen } from '@/lib/date';
import { downloadIcs, googleCalendarUrl } from '@/lib/calendar';
import { shareOpportunity, whatsappShareUrl } from '@/lib/share';
import { exportStoryCard } from '@/lib/storyCard';
import { springPop } from '@/lib/motion';
import { DeadlineChip } from './DeadlineChip';

interface OpportunityDrawerProps {
  opp: Opportunity | null;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onClose: () => void;
}

const DEFAULT_CHECKLIST = [
  'Confirm latest eligibility & grade requirements on the official page',
  'Verify registration fees, team size, and submission format',
  'Check whether attendance is online or in-person in Hyderabad',
];

export function OpportunityDrawer({
  opp,
  isSaved,
  onToggleSave,
  onClose,
}: OpportunityDrawerProps) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [shareFeedback, setShareFeedback] = useState('');

  useEffect(() => {
    if (!opp) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [opp, onClose]);

  const handleShare = async () => {
    if (!opp) return;
    const mode = await shareOpportunity(opp);
    setShareFeedback(mode === 'copied' ? 'Link copied!' : 'Shared!');
    setTimeout(() => setShareFeedback(''), 2000);
  };

  const open = opp ? isOpen(getDeadlineStatus(opp.deadlineISO)) : false;
  const gcal = opp ? googleCalendarUrl(opp) : null;

  return (
    <AnimatePresence>
      {opp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex justify-end bg-black/65 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="opp-drawer-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={springPop}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg h-full bg-[#09090b] text-zinc-100 border-l border-white/[0.1] flex flex-col shadow-2xl overflow-y-auto"
          >
            <div className="px-6 py-5 border-b border-white/[0.08] flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-mono text-zinc-400">
                    {opp.indexLabel} · {opp.category}
                  </span>
                  <DeadlineChip
                    deadlineLabel={opp.deadlineLabel}
                    deadlineISO={opp.deadlineISO}
                  />
                </div>
                <h2 id="opp-drawer-title" className="text-xl font-semibold text-white">
                  {opp.title}
                </h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 cursor-pointer"
                aria-label="Close opportunity details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1">
              <p className="text-sm text-zinc-300 leading-relaxed">{opp.copy}</p>

              {/* Spec Table */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c0e] divide-y divide-white/[0.06] text-xs">
                <div className="px-4 py-3 flex justify-between gap-4">
                  <span className="text-zinc-500 font-mono">ELIGIBILITY</span>
                  <span className="text-zinc-200 text-right">{opp.targetClasses}</span>
                </div>
                <div className="px-4 py-3 flex justify-between gap-4">
                  <span className="text-zinc-500 font-mono">FORMAT</span>
                  <span className="text-zinc-200 text-right">{opp.format}</span>
                </div>
                <div className="px-4 py-3 flex justify-between gap-4">
                  <span className="text-zinc-500 font-mono">DEADLINE</span>
                  <span className="text-zinc-200 text-right">{opp.deadlineLabel}</span>
                </div>
              </div>

              {/* Before You Apply Checklist */}
              <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-4">
                <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 mb-3">
                  Before you apply
                </p>
                <ul className="space-y-2.5 text-xs text-zinc-300">
                  {(opp.checklist ?? DEFAULT_CHECKLIST).map((step) => (
                    <li key={step} className="flex items-start gap-2.5">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => onToggleSave(opp.id)}
                  className={`inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-medium active:scale-95 transition-all cursor-pointer ${
                    isSaved
                      ? 'border-[#e6c98b]/45 bg-[#e6c98b]/15 text-[#e6c98b]'
                      : 'border-white/[0.1] bg-white/[0.03] text-slate-200 hover:bg-white/[0.08]'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                  <span>{isSaved ? 'Saved' : 'Save to shortlist'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.03] text-xs font-medium text-slate-200 hover:bg-white/[0.08] active:scale-95 transition-all cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{shareFeedback || 'Share link'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => exportStoryCard(opp)}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.03] text-xs font-medium text-slate-200 hover:bg-white/[0.08] active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#e6c98b]" />
                  <span>Share to Story</span>
                </button>

                <a
                  href={whatsappShareUrl(opp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.03] text-xs font-medium text-zinc-200 hover:bg-white/[0.08] transition-colors"
                >
                  <span>WhatsApp</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {open && opp.deadlineISO && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => downloadIcs(opp)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/[0.1] bg-white/[0.03] text-xs text-zinc-200 hover:bg-white/[0.08] cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Download .ics</span>
                  </button>
                  {gcal && (
                    <a
                      href={gcal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/[0.1] bg-white/[0.03] text-xs text-zinc-200 hover:bg-white/[0.08]"
                    >
                      <span>Google Calendar</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/[0.08]">
              {opp.url.startsWith('#') ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    document.querySelector(opp.url)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  <span>Go to Founding Team</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              ) : (
                <a
                  href={opp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors"
                >
                  <span>Open Official Page</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default OpportunityDrawer;
