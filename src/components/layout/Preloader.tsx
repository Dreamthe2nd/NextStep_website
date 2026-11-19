import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface PreloaderProps {
  onComplete: () => void;
}

const SESSION_KEY = 'nextstep:preloader:seen';

export function Preloader({ onComplete }: PreloaderProps) {
  const reduced = useReducedMotion();
  const [alreadySeen] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [fading, setFading] = useState(false);
  const [done, setDone] = useState(alreadySeen || reduced);

  useEffect(() => {
    if (done) {
      onComplete();
      return;
    }

    const fadeTimer = setTimeout(() => setFading(true), 1250);
    const doneTimer = setTimeout(() => {
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        // ignore storage errors
      }
      setDone(true);
      onComplete();
    }, 1850);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [done, onComplete]);

  if (done) return null;

  const skip = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // ignore
    }
    setFading(true);
    setTimeout(() => {
      setDone(true);
      onComplete();
    }, 260);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-[#09090b] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        fading ? 'opacity-0 pointer-events-none scale-[1.015]' : 'opacity-100 scale-100'
      }`}
      style={{
        clipPath: fading ? 'inset(0% 0% 100% 0%)' : 'inset(0% 0% 0% 0%)',
      }}
      aria-hidden={fading}
    >
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        {/* Cypher-Capital-inspired Horizontal Wordmark + Central Metallic Infinity-Step Link */}
        <div className="inline-flex items-center gap-4 sm:gap-6">
          <span className="text-2xl sm:text-4xl font-medium tracking-[-0.04em] text-[#09090b]">
            NextStep
          </span>

          <svg
            width="64"
            height="34"
            viewBox="0 0 64 34"
            fill="none"
            className="w-12 h-7 sm:w-16 sm:h-9 shrink-0"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="ns-cypher-chrome" x1="4" y1="4" x2="60" y2="30" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f4f4f5" />
                <stop offset="32%" stopColor="#a1a1aa" />
                <stop offset="56%" stopColor="#ffffff" />
                <stop offset="82%" stopColor="#d9b56d" />
                <stop offset="100%" stopColor="#d4d4d8" />
              </linearGradient>
              <linearGradient id="ns-cypher-inner" x1="10" y1="28" x2="54" y2="6" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#71717a" />
                <stop offset="50%" stopColor="#e4e4e7" />
                <stop offset="100%" stopColor="#b08b46" />
              </linearGradient>
            </defs>
            {/* Outer beveled capsule-step link */}
            <path
              d="M17 26C10.9 26 6 21.1 6 15C6 8.9 10.9 4 17 4H26.5C29.8 4 32.4 5.5 34.4 8L37.5 11.8C39 13.7 41.2 14.8 43.8 14.8H47C51.4 14.8 55 18.4 55 22.8C55 27.2 51.4 30.8 47 30.8H37.5C34.2 30.8 31.6 29.3 29.6 26.8L26.5 23C25 21.1 22.8 20 20.2 20H17Z"
              stroke="url(#ns-cypher-chrome)"
              strokeWidth="5.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17 20C14.2 20 12 17.8 12 15C12 12.2 14.2 10 17 10H26.5C28.1 10 29.5 10.7 30.5 11.9L36.5 19.3C38.1 21.2 40.4 22.4 43.2 22.4H47C48.8 22.4 50.2 23.8 50.2 25.5"
              stroke="url(#ns-cypher-inner)"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>

          <span className="text-2xl sm:text-4xl font-medium tracking-[-0.04em] text-[#09090b]">
            Hyderabad
          </span>
        </div>

        {/* Hairline loading bar + subtle student metadata */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-28 h-[1.5px] bg-zinc-200 overflow-hidden rounded-full">
            <div className="h-full bg-gradient-to-r from-[#09090b] via-[#d9b56d] to-[#09090b] animate-[ns-bar_1.2s_cubic-bezier(0.22,1,0.36,1)_forwards]" />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-zinc-500">
            Discover · Apply · Grow
          </p>
        </div>

        <button
          type="button"
          onClick={skip}
          className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:text-[#09090b] transition-colors cursor-pointer"
        >
          Skip intro →
        </button>
      </div>
    </div>
  );
}
