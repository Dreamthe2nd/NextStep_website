import { Suspense, lazy, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useSiteData } from '@/context/SiteDataContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { registerGsap } from '@/lib/motion';
import { Footer } from '@/components/layout/Footer';
import { Newsletter } from './Newsletter';

const KineticStarburst = lazy(() => import('./KineticStarburst'));

export function Finale() {
  const { about, meta } = useSiteData();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const curtainRef = useRef<HTMLDivElement | null>(null);
  const leftSplitRef = useRef<HTMLDivElement | null>(null);
  const rightSplitRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduced || !sectionRef.current) return;
    registerGsap();

    const ctx = gsap.context(() => {
      // Root canvas polarity flip matching white curtain wipe
      gsap.to(document.documentElement, {
        '--bg': '#ffffff',
        '--fg': '#09090b',
        '--muted-fg': '#52525b',
        '--hairline': 'rgba(24, 24, 27, 0.14)',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          end: 'top 20%',
          scrub: true,
        },
      });

      // Restored Old Finale rounded curtain clip-path expansion
      if (curtainRef.current) {
        gsap.fromTo(
          curtainRef.current,
          { clipPath: 'inset(6% 4% 0% 4% round 28px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 90%',
              end: 'top 25%',
              scrub: true,
            },
          }
        );
      }

      // Opposing horizontal split reveal with full ink contrast
      if (leftSplitRef.current && rightSplitRef.current) {
        gsap.fromTo(
          leftSplitRef.current,
          { x: -64, opacity: 0.72 },
          {
            x: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 86%',
              end: 'top 38%',
              scrub: true,
            },
          }
        );

        gsap.fromTo(
          rightSplitRef.current,
          { x: 64, opacity: 0.72 },
          {
            x: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 86%',
              end: 'top 38%',
              scrub: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-heading"
      className="relative z-[10] bg-transparent text-zinc-950 overflow-x-clip"
    >
      <div
        ref={curtainRef}
        className="bg-white text-zinc-950 will-change-[clip-path] shadow-[0_-32px_90px_rgba(0,0,0,0.65)]"
      >
        <div className="mx-auto w-full max-w-[1140px] px-5 md:px-8 pt-24 pb-14 border-b border-zinc-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div ref={leftSplitRef} className="lg:col-span-5 will-change-transform">
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-zinc-600 mb-3">
                {about.eyebrow}
              </p>
              <h2
                id="about-heading"
                className="text-3xl sm:text-5xl font-semibold tracking-[-0.045em] text-zinc-950"
              >
                {about.headline}
              </h2>
            </div>
            <div
              ref={rightSplitRef}
              className="lg:col-span-7 space-y-5 text-sm sm:text-base text-zinc-700 leading-relaxed will-change-transform"
            >
              <p>{about.story}</p>
              <blockquote className="font-serif italic text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.08] tracking-[-0.02em] text-zinc-950 py-2">
                “{meta.quote}”
              </blockquote>
              <p>{about.vision}</p>
            </div>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="py-24 text-center text-xs font-mono text-zinc-500">
              Loading interactive mark...
            </div>
          }
        >
          <KineticStarburst />
        </Suspense>

        <Newsletter />
        <Footer />
      </div>
    </section>
  );
}
