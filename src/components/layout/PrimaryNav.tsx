import { Sparkles } from 'lucide-react';
import { useSiteData } from '@/context/SiteDataContext';
import { useLenisScroll } from '@/hooks/useLenis';
import { Pill } from '@/components/ui/Pill';

interface PrimaryNavProps {
  onOpenScout: () => void;
}

export function PrimaryNav({ onOpenScout }: PrimaryNavProps) {
  const { meta } = useSiteData();
  const { scrollTo } = useLenisScroll();

  return (
    <header className="relative z-30 border-b border-[var(--hairline)] bg-[#09090b]/90 backdrop-blur-md">
      <div className="mx-auto w-full max-w-[1320px] px-5 md:px-10 h-16 flex items-center justify-between gap-4">
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            scrollTo('#hero', 0);
          }}
          className="flex items-center gap-3 group"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="shrink-0 transition-transform duration-300 group-hover:scale-105"
          >
            <rect
              x="1"
              y="1"
              width="30"
              height="30"
              rx="8"
              fill="#121215"
              stroke="rgba(250,248,242,0.18)"
            />
            <path
              d="M9.5 22V10L22.5 22V10"
              stroke="url(#ns-chrome)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="ns-chrome" x1="9" y1="10" x2="23" y2="22">
                <stop stopColor="#faf8f2" />
                <stop offset="0.55" stopColor="#d9b56d" />
                <stop offset="1" stopColor="#faf8f2" />
              </linearGradient>
            </defs>
          </svg>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight text-white whitespace-nowrap">
              {meta.brand}
            </span>
            <span className="hidden sm:block text-[10px] tracking-widest uppercase text-zinc-400 mt-0.5 whitespace-nowrap">
              {meta.tagline}
            </span>
          </div>
        </a>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-7 text-xs font-medium text-zinc-400">
          <a
            href="#opportunities"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('#opportunities');
            }}
            className="hover:text-white transition-colors"
          >
            Opportunities
          </a>
          <a
            href="#consultations"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('#consultations');
            }}
            className="hover:text-white transition-colors"
          >
            Consultations
          </a>
          <a
            href="#team"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('#team');
            }}
            className="hover:text-white transition-colors"
          >
            Team
          </a>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('#about');
            }}
            className="hover:text-white transition-colors"
          >
            About
          </a>
        </nav>

        <Pill variant="primary" onClick={onOpenScout} className="px-3.5 py-2 shrink-0 whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" aria-hidden="true" />
          <span className="sm:hidden">AI Scout</span>
          <span className="hidden sm:inline">Find Research Opportunities</span>
        </Pill>
      </div>
    </header>
  );
}
