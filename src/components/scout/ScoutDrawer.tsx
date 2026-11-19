import { useEffect, useRef } from 'react';
import { Layers, Send, Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useScout } from '@/hooks/useScout';
import { springPop } from '@/lib/motion';

const QUICK_PROMPTS = [
  'Find STEM & AI Research Competitions',
  'Science Fairs to ISEF (IRIS Pathway)',
  'Research Fellowships for Classes 9–12',
  'Hyderabad Local Innovation & Lab Challenges',
];

interface ScoutDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function ScoutDrawer({ open, onClose }: ScoutDrawerProps) {
  const { query, setQuery, loading, results, mode, runSearch } = useScout();
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
            aria-labelledby="scout-drawer-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={springPop}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl h-full bg-[#09090b] text-zinc-100 border-l border-white/[0.1] flex flex-col shadow-2xl"
          >
            <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" aria-hidden="true" />
                  <h2 id="scout-drawer-title" className="text-sm font-semibold text-white">
                    NextStep Research Opportunity Scout
                  </h2>
                </div>
                <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                  {mode === 'live'
                    ? 'Live Gemini Flash (1,500 RPD Free Tier)'
                    : 'Curated listings · Live AI coming soon'}
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 transition-colors cursor-pointer"
                aria-label="Close Research Scout"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-4 border-b border-white/[0.08] space-y-3">
              <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
                Quick-Action Research Prompts
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => runSearch(chip)}
                    className="px-3 py-1.5 rounded-full text-[11px] font-medium bg-white/[0.04] border border-white/[0.1] text-zinc-300 hover:text-white hover:border-amber-400/40 transition-colors cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runSearch();
                }}
                className="flex gap-2 pt-1"
              >
                <label htmlFor="scout-query-input" className="sr-only">
                  Search research opportunities
                </label>
                <input
                  id="scout-query-input"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask about Class 9–12 fellowships, IRIS, IIIT-H..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-black border border-white/[0.1] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/30"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{loading ? 'Scouting...' : 'Scout'}</span>
                </button>
              </form>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {results.map((item, idx) => (
                <div
                  key={`${item.name}-${idx}`}
                  className="rounded-2xl bg-[#0c0c0e] border border-white/[0.08] p-5 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-white">{item.name}</h3>
                    <Layers className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-white/[0.05] text-zinc-300">
                      {item.eligibility}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300">
                      {item.deadline}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    <strong className="text-zinc-200">Focus:</strong> {item.focusAreas}
                  </p>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    <strong className="text-zinc-200">How to Apply:</strong> {item.howToApply}
                  </p>
                </div>
              ))}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ScoutDrawer;
