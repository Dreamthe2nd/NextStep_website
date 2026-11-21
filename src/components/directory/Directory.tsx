import { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useSiteData } from '@/context/SiteDataContext';
import type { FilterGroup, Opportunity } from '@/data/schema';
import { getDeadlineStatus, isOpen, sortByStatus } from '@/lib/date';
import { useLenisScroll } from '@/hooks/useLenis';
import { SectionIndex } from '@/components/ui/SectionIndex';
import { KineticHeading } from '@/components/ui/KineticHeading';
import { DepartureBoard } from '@/components/hero/DepartureBoard';
import { OpportunityCard } from './OpportunityCard';

const FILTER_CATEGORIES: Array<'All' | FilterGroup> = [
  'All',
  'AI & Innovation',
  'STEM & Research',
  'Entrepreneurship',
  'MUN & Leadership',
  'Scholarships',
  'Community',
];

interface DirectoryProps {
  onOpenScout: () => void;
  onSelectOpportunity: (opp: Opportunity) => void;
  savedIds?: Set<string>;
  onToggleSave?: (id: string) => void;
}

export function Directory({
  onOpenScout,
  onSelectOpportunity,
  savedIds,
  onToggleSave,
}: DirectoryProps) {
  const { opportunities } = useSiteData();
  const { scrollTo } = useLenisScroll();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | FilterGroup>('All');
  const [openOnly, setOpenOnly] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const isMac =
    typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.platform || '');

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        scrollTo('#opportunities');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [scrollTo]);

  const filtered = useMemo(() => {
    const sorted = sortByStatus(opportunities);
    return sorted.filter((item) => {
      if (activeCategory !== 'All' && item.filterGroup !== activeCategory) return false;
      if (openOnly && !isOpen(getDeadlineStatus(item.deadlineISO))) return false;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      const hay =
        `${item.title} ${item.category} ${item.eligibility} ${item.copy} ${item.deadlineLabel}`.toLowerCase();
      return hay.includes(q);
    });
  }, [opportunities, activeCategory, openOnly, searchQuery]);

  const onFilterKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const nextIdx =
      e.key === 'ArrowRight'
        ? (idx + 1) % FILTER_CATEGORIES.length
        : (idx - 1 + FILTER_CATEGORIES.length) % FILTER_CATEGORIES.length;
    setActiveCategory(FILTER_CATEGORIES[nextIdx]);
  };

  return (
    <section
      id="opportunities"
      aria-labelledby="opportunities-heading"
      className="relative bg-transparent py-24 sm:py-32 border-b border-[var(--hairline)]"
    >
      <div className="mx-auto w-full max-w-[1140px] px-5 md:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <SectionIndex index="01" label="OPPORTUNITIES DIRECTORY" className="mb-3" />
            <KineticHeading
              id="opportunities-heading"
              text="Opportunities worth"
              italicTail="opening a new tab for."
              className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-[-0.045em] text-white"
              italicClassName="text-zinc-400"
            />
            <p className="mt-3 text-sm text-zinc-400 max-w-2xl">
              Explore a starting collection of student opportunities. Always check the official page
              for the latest eligibility, fees and deadlines before applying.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full lg:w-auto shrink-0">
            <div
              className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#121215] border border-[var(--hairline)] shrink-0 self-start sm:self-auto"
              aria-label={`${opportunities.length} opportunities tracked`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#93c5fd] shadow-[0_0_8px_rgba(147,197,253,0.75)]" aria-hidden="true" />
              <span className="font-mono text-xs font-semibold tabular-nums text-white">
                {opportunities.length}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-400 whitespace-nowrap">
                Opportunities tracked
              </span>
            </div>

            <div className="relative w-full sm:w-72 lg:w-80 shrink-0">
              <label htmlFor="directory-search" className="sr-only">
                Search opportunities
              </label>
              <Search
                className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="directory-search"
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, class, category..."
                className="w-full pl-10 pr-16 py-2.5 rounded-xl bg-[#121215] border border-[var(--hairline)] text-sm text-[#faf8f2] placeholder:text-zinc-500 focus:outline-none focus:border-[#d9b56d]/50 transition-colors"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-white/[0.06] border border-white/[0.1] rounded">
                {isMac ? '⌘K' : 'Ctrl K'}
              </kbd>
            </div>
          </div>
        </div>

        {/* Live Split-Flap Departure Board (moved cleanly into the Directory) */}
        <div className="mb-10">
          <DepartureBoard
            opportunities={opportunities}
            onSelectOpportunity={onSelectOpportunity}
          />
        </div>

        {/* Category Filter Pills + Open Only Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-10">
          <div
            role="radiogroup"
            aria-label="Filter opportunities by category"
            className="flex flex-wrap items-center gap-2"
          >
            {FILTER_CATEGORIES.map((cat, idx) => {
              const active = activeCategory === cat;
              return (
                <motion.button
                  key={cat}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 24 }}
                  onClick={() => setActiveCategory(cat)}
                  onKeyDown={(e) => onFilterKeyDown(e, idx)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors border cursor-pointer ${
                    active
                      ? 'text-[#09090b] border-[#faf8f2]'
                      : 'bg-[#121215] text-zinc-400 border-[var(--hairline)] hover:text-white hover:border-white/20'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="dir-active-cat"
                      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                      className="absolute inset-0 rounded-full bg-white -z-0"
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </motion.button>
              );
            })}
          </div>

          <motion.button
            type="button"
            role="switch"
            aria-checked={openOnly}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 500, damping: 24 }}
            onClick={() => setOpenOnly((v) => !v)}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono border transition-colors cursor-pointer ${
              openOnly
                ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-300'
                : 'border-[var(--hairline)] bg-[#121215] text-zinc-400 hover:text-white'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                openOnly ? 'bg-emerald-400' : 'bg-zinc-600'
              }`}
              aria-hidden="true"
            />
            <span>Open only</span>
          </motion.button>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-[var(--hairline)] bg-[#0c0c0e] p-12 text-center">
            <p className="text-sm text-zinc-400">
              No opportunities matched your filter. Try clearing the search or ask the{' '}
              <button
                type="button"
                onClick={onOpenScout}
                className="text-amber-400 underline underline-offset-4 hover:text-amber-300 cursor-pointer"
              >
                Research Opportunity Scout
              </button>
              .
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((opp, idx) => (
                <OpportunityCard
                  key={opp.id}
                  opp={opp}
                  index={idx}
                  isSaved={savedIds?.has(opp.id)}
                  onToggleSave={onToggleSave}
                  onOpenDetail={onSelectOpportunity}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
