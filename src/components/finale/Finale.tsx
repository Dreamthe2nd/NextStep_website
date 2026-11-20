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
  const horizonGlowRef = useRef<HTMLDivElement | null>(null);
  const horizonLineRef = useRef<HTMLDivElement | null>(null);
  const curtainRef = useRef<HTMLDivElement | null>(null);
  const leftSplitRef = useRef<HTMLDivElement | null>(null);
  const rightSplitRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduced || !sectionRef.current) return;
    registerGsap();

    const ctx = gsap.context(() => {
      // Smooth root canvas polarity flip timed after the curtain opens
      gsap.to(document.documentElement, {
        '--bg': '#ffffff',
        '--fg': '#09090b',
        '--muted-fg': '#52525b',
        '--hairline': 'rgba(24, 24, 27, 0.14)',
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 68%',
          end: 'top 15%',
          scrub: 0.7,
        },
      });

      // Celestial dawn horizon glow + expanding hairline bridge
      if (horizonGlowRef.current) {
        gsap.fromTo(
          horizonGlowRef.current,
          { opacity: 0.15, scale: 0.85 },
          {
            opacity: 1,
            scale: 1.08,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 98%',
              end: 'top 45%',
              scrub: 0.7,
            },
          }
        );
      }

      if (horizonLineRef.current) {
        gsap.fromTo(
          horizonLineRef.current,
          { scaleX: 0.14, opacity: 0.2 },
          {
            scaleX: 1,
            opacity: 0.9,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 95%',
              end: 'top 42%',
              scrub: 0.7,
            },
          }
        );
      }

      // Silky rounded portal-to-full-bleed curtain expansion (no top clip gap)
      if (curtainRef.current) {
        gsap.fromTo(
          curtainRef.current,
          {
            clipPath: 'inset(0% 4.5% 0% 4.5% round 32px)',
            y: 40,
            scale: 0.975,
          },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
            y: 0,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 92%',
              end: 'top 24%',
              scrub: 0.75,
            },
          }
        );
      }

      // Choreographed editorial reveal for left & right columns
      if (leftSplitRef.current) {
        gsap.fromTo(
          leftSplitRef.current,
          { y: 36, opacity: 0.15 },
          {
            y: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 82%',
              end: 'top 36%',
              scrub: 0.65,
            },
          }
        );
      }

      if (rightSplitRef.current) {
        const items = rightSplitRef.current.querySelectorAll('[data-finale-reveal]');
        gsap.fromTo(
          items,
          { y: 28, opacity: 0.1 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 78%',
              end: 'top 30%',
              scrub: 0.65,
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
      className="relative z-[10] bg-transparent text-zinc-950 overflow-x-clip pt-14 sm:pt-20"
    >
      {/* Celestial dawn horizon bridge from midnight cosmos to daylight Finale */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative h-16 sm:h-24 w-full flex flex-col items-center justify-end overflow-hidden"
      >
        <div
          ref={horizonGlowRef}
          className="absolute inset-x-0 bottom-0 h-32 mx-auto max-w-4xl rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse at 50% 100%, rgba(230,201,139,0.28) 0%, rgba(147,197,253,0.16) 45%, transparent 75%)',
          }}
        />
        <div
          ref={horizonLineRef}
          className="relative w-full max-w-[1140px] h-px bg-gradient-to-r from-transparent via-[#e6c98b]/70 to-transparent origin-center"
        />
      </div>

      <div
        ref={curtainRef}
        className="bg-white text-zinc-950 will-change-[clip-path,transform] shadow-[0_-40px_110px_rgba(4,7,17,0.75)]"
      >
        <div className="mx-auto w-full max-w-[1140px] px-5 md:px-8 pt-20 sm:pt-24 pb-14 border-b border-zinc-200">
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
              className="lg:col-span-7 space-y-5 text-sm sm:text-base text-zinc-700 leading-relaxed"
            >
              <p data-finale-reveal className="will-change-transform">
                {about.story}
              </p>
              <blockquote
                data-finale-reveal
                className="font-serif italic text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.08] tracking-[-0.02em] text-zinc-950 py-2 border-l-2 border-[#c8a96e]/55 pl-5 sm:pl-7 will-change-transform"
              >
                “{meta.quote}”
              </blockquote>
              <p data-finale-reveal className="will-change-transform">
                {about.vision}
              </p>
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
