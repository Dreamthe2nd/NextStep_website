import { Bookmark, Sparkles } from 'lucide-react';
import { useLenisScroll } from '@/hooks/useLenis';

interface StickySubNavProps {
  visible: boolean;
  activeSection: string;
  onOpenScout: () => void;
  shortlistCount?: number;
  onOpenShortlist?: () => void;
}

export function StickySubNav({
  visible,
  activeSection,
  onOpenScout,
  shortlistCount = 0,
  onOpenShortlist,
}: StickySubNavProps) {
  const { scrollTo } = useLenisScroll();

  return (
    <div
      className={`fixed top-0 inset-x-0 z-40 backdrop-blur-xl bg-[#09090b]/85 border-b border-white/[0.08] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible
          ? 'translate-y-0 opacity-100'
          : '-translate-y-full opacity-0 pointer-events-none'
      }`}
      aria-hidden={!visible}
    >
      <div className="mx-auto w-full max-w-[1320px] px-5 md:px-10 h-12 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-zinc-400 truncate min-w-0">
          <span className="font-semibold text-[#faf8f2] hidden sm:inline">NextStep Hyderabad</span>
          <span className="text-zinc-600 hidden sm:inline">/</span>
          <span className="text-[#d9b56d] font-mono text-[11px] truncate">{activeSection}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => scrollTo('#opportunities')}
            className="hidden sm:inline-flex px-2.5 py-1 rounded-full border border-white/[0.1] text-zinc-300 hover:text-white hover:border-white/25 active:scale-95 transition-all cursor-pointer"
          >
            Directory
          </button>
          <button
            type="button"
            onClick={() => scrollTo('#consultations')}
            className="hidden sm:inline-flex px-2.5 py-1 rounded-full border border-white/[0.1] text-zinc-300 hover:text-white hover:border-white/25 active:scale-95 transition-all cursor-pointer"
          >
            Consultations
          </button>
          {onOpenShortlist && (
            <button
              type="button"
              onClick={onOpenShortlist}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/15 bg-white/[0.06] text-zinc-200 hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
              aria-label={`Open shortlist (${shortlistCount} saved)`}
            >
              <Bookmark className="w-3 h-3 text-[#e6c98b]" aria-hidden="true" />
              <span className="hidden sm:inline">Shortlist</span>
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-white/10">
                {shortlistCount}
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={onOpenScout}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-[#e6c98b]" aria-hidden="true" />
            <span>AI Scout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
