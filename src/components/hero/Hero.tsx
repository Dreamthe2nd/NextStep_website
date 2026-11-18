import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Compass, RotateCcw, ShieldCheck, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import type { Opportunity } from '@/data/schema';
import { useSiteData } from '@/context/SiteDataContext';
import { useLenisScroll } from '@/hooks/useLenis';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { registerGsap } from '@/lib/motion';
import { Pill } from '@/components/ui/Pill';
import Galaxy from '@/components/reactbits/Galaxy';
import LightRays from '@/components/reactbits/LightRays';
import SpecularButton from '@/components/reactbits/SpecularButton';
import { ConstellationCanvas } from './ConstellationCanvas';

interface HeroProps {
  onOpenScout: () => void;
  onSelectOpportunity: (opp: Opportunity) => void;
}

export function Hero({ onOpenScout, onSelectOpportunity }: HeroProps) {
  const { hero, pillars, opportunities } = useSiteData();
  const { scrollTo } = useLenisScroll();
  const reduced = useReducedMotion();

  const [entranceKey, setEntranceKey] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const titlePlaneRef = useRef<HTMLDivElement | null>(null);
  const foregroundPlaneRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (reduced) return;
    registerGsap();

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      const isDesktop = window.innerWidth >= 1024;

      if (isDesktop) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=420',
            pin: true,
            scrub: 0.5,
            invalidateOnRefresh: true,
            onUpdate: (self) => setScrollProgress(self.progress),
          },
        });

        if (titlePlaneRef.current) {
          tl.to(
            titlePlaneRef.current,
            {
              y: -38,
              scale: 0.94,
              opacity: 0.14,
              ease: 'none',
            },
            0
          );
        }

        if (foregroundPlaneRef.current) {
          tl.fromTo(
            foregroundPlaneRef.current,
            { y: 12, scale: 0.985 },
            { y: -24, scale: 1.005, ease: 'none' },
            0
          );
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  const easeExpo = [0.16, 1, 0.3, 1] as const;

  return (
    <section
      id="hero"
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-transparent border-b border-[var(--hairline)] min-h-[calc(100vh-4rem)] flex flex-col justify-between pt-5 sm:pt-7"
    >
      {/* Cosmic Radial Vignette (Blue-dominant contrast) + WebGL2 Starfield Galaxy */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_15%,rgba(37,99,235,0.24),rgba(9,9,11,0.9)_72%)]"
      />
      {!reduced && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[0] opacity-90">
          <Galaxy
            key={`galaxy-${entranceKey}`}
            intro={true}
            clickWarp={true}
            mouseInteraction={true}
            mouseRepulsion={true}
            repulsionStrength={1.6}
            density={1.15}
            hueShift={210}
            glowIntensity={0.45}
            saturation={0.55}
            twinkleIntensity={0.45}
            rotationSpeed={0.05}
            starSpeed={0.38}
            starColors={['#93c5fd', '#60a5fa', '#e0f2fe', '#e6c98b']}
            transparent={true}
          />
        </div>
      )}

      {/* Subtle Overhead Celestial Blue Spotlight */}
      {!reduced && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[0] opacity-40">
          <LightRays
            raysOrigin="top-center"
            raysColor="#93c5fd"
            raysSpeed={0.55}
            lightSpread={0.62}
            rayLength={1.2}
            fadeDistance={1.0}
            haze={0.3}
            intensity={0.7}
            followMouse={true}
            mouseInfluence={0.08}
          />
        </div>
      )}

      {/* Interactive Opportunity Constellation Nodes */}
      <ConstellationCanvas
        opportunities={opportunities}
        convergeProgress={scrollProgress}
        onSelectOpportunity={onSelectOpportunity}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5 md:px-10 flex-1 flex flex-col justify-between pointer-events-none">
        {/* Top Edge Lockup + Circular Replay Control */}
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400 pointer-events-auto">
          <span className="text-zinc-300">NEXTSTEP // HYDERABAD</span>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-zinc-400">DISCOVER · APPLY · GROW</span>
            {!reduced && (
              <motion.button
                type="button"
                whileHover={{ rotate: -90, scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 420, damping: 20 }}
                onClick={() => setEntranceKey((k) => k + 1)}
                title="Replay entrance animation"
                aria-label="Replay hero entrance animation"
                className="w-8 h-8 rounded-full border border-white/[0.14] bg-[#121215]/80 hover:border-[#d9b56d]/50 text-zinc-300 hover:text-[#d9b56d] flex items-center justify-center transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Plane 1: Focal Headline + CTAs */}
        <div
          key={`hero-stage-${entranceKey}`}
          ref={titlePlaneRef}
          className="max-w-4xl mx-auto text-center my-auto py-4 sm:py-6 pointer-events-auto will-change-transform"
        >
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: easeExpo, delay: 0.05 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/[0.12] bg-[#121215]/80 backdrop-blur-md font-mono text-[11px] uppercase tracking-[0.18em] text-[#faf8f2] mb-5"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d9b56d] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d9b56d]" />
            </span>
            <span>{hero.badge}</span>
          </motion.div>

          <h1
            id="hero-heading"
            className="text-5xl sm:text-6xl lg:text-[4.65rem] font-semibold tracking-[-0.048em] text-[#faf8f2] leading-[0.98]"
          >
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span
                initial={reduced ? false : { y: '105%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration: 0.9, ease: easeExpo, delay: 0.14 }}
                className="block"
              >
                {hero.headlinePrefix}
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              <motion.span
                initial={reduced ? false : { y: '105%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration: 0.95, ease: easeExpo, delay: 0.24 }}
                className="block mt-1 font-serif italic font-normal tracking-[-0.02em] text-transparent bg-clip-text bg-gradient-to-r from-[#faf8f2] via-[#f0dfb4] to-[#93c5fd]"
              >
                {hero.headlineItalic}
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 18, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.85, ease: easeExpo, delay: 0.35 }}
            className="mt-5 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            {hero.mission}
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: easeExpo, delay: 0.45 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Pill
              variant="primary"
              onClick={() => scrollTo('#opportunities')}
              className="px-6 py-3.5 text-xs uppercase tracking-[0.12em] font-semibold"
            >
              <span>Explore opportunities</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </Pill>
            <motion.div
              whileHover={reduced ? undefined : { y: -1.5, scale: 1.025 }}
              whileTap={reduced ? undefined : { scale: 0.955 }}
              transition={{ type: 'spring', stiffness: 480, damping: 24 }}
            >
              <SpecularButton
                size="sm"
                radius={999}
                tint="#121215"
                tintOpacity={0.8}
                textColor="#faf8f2"
                lineColor="#d9b56d"
                onClick={onOpenScout}
                className="text-xs uppercase tracking-[0.12em] font-medium"
              >
                <Compass className="w-4 h-4 text-[#d9b56d]" aria-hidden="true" />
                <span>Launch Research Scout</span>
              </SpecularButton>
            </motion.div>
          </motion.div>
        </div>

        {/* Plane 2: Bottom-Anchored 3-Step Discover / Apply / Grow Bar */}
        <motion.div
          key={`hero-fg-${entranceKey}`}
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeExpo, delay: 0.52 }}
          ref={foregroundPlaneRef}
          className="pointer-events-auto will-change-transform"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 border border-[var(--hairline)] bg-[#121215]/85 backdrop-blur-md">
            {pillars.map((pillar, idx) => (
              <div
                key={pillar.id}
                className={`p-4 sm:p-5 transition-colors duration-300 hover:bg-white/[0.03] ${
                  idx > 0 ? 'border-t border-[var(--hairline)] md:border-t-0 md:border-l' : ''
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400 mb-2">
                  <span>{pillar.metricTag}</span>
                  {idx === 0 && <Compass className="w-4 h-4 text-[#d9b56d]" aria-hidden="true" />}
                  {idx === 1 && <ShieldCheck className="w-4 h-4 text-[#93c5fd]" aria-hidden="true" />}
                  {idx === 2 && <Trophy className="w-4 h-4 text-[#faf8f2]" aria-hidden="true" />}
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-[#faf8f2] tracking-[-0.03em]">
                  {pillar.title}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Edge-Masked Running Hairline Ticker */}
      <div className="relative z-10 mt-5 border-t border-[var(--hairline)] bg-[#09090b]/85 py-2.5 overflow-hidden marquee-mask">
        <div className="animate-ticker font-mono text-[11px] tracking-[0.2em] uppercase text-zinc-400">
          {[0, 1, 2, 3].map((dup) => (
            <span key={dup} className="inline-flex items-center gap-7 px-7 shrink-0">
              {hero.tickerItems.map((item, idx) => (
                <span key={item} className="inline-flex items-center gap-7">
                  <span>{item}</span>
                  <span className={idx % 2 === 0 ? 'text-[#d9b56d]' : 'text-[#93c5fd]'}>✳</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
