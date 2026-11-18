import { useEffect, useRef } from 'react';
import { ArrowUpRight, Bookmark, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { Opportunity } from '@/data/schema';
import { springPop } from '@/lib/motion';
import { DeadlineChip } from './DeadlineChip';

interface ShortlistPanelProps {
  open: boolean;
  items: Opportunity[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onSelect: (opp: Opportunity) => void;
}

export function ShortlistPanel({
  open,
  items,
  onClose,
  onRemove,
  onSelect,
}: ShortlistPanelProps) {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortlist-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={springPop}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md h-full bg-[#09090b] text-zinc-100 border-l border-white/[0.1] flex flex-col shadow-2xl"
          >
            <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-400" />
                <h2 id="shortlist-title" className="text-sm font-semibold text-white">
                  My Shortlist ({items.length})
                </h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 cursor-pointer"
                aria-label="Close shortlist"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {items.length === 0 ? (
                <p className="text-xs text-zinc-400 text-center py-12">
                  No saved opportunities yet. Tap the bookmark icon on any card to save it here.
                </p>
              ) : (
                items.map((opp) => (
                  <div
                    key={opp.id}
                    className="rounded-2xl border border-white/[0.08] bg-[#0c0c0e] p-4 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelect(opp);
                        }}
                        className="text-left text-sm font-semibold text-white hover:text-amber-300 transition-colors cursor-pointer"
                      >
                        {opp.title}
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemove(opp.id)}
                        aria-label={`Remove ${opp.title}`}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <DeadlineChip
                        deadlineLabel={opp.deadlineLabel}
                        deadlineISO={opp.deadlineISO}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelect(opp);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white cursor-pointer"
                      >
                        <span>Open</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
