import { useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, Minus, Plus, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSiteData } from '@/context/SiteDataContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { registerGsap } from '@/lib/motion';
import { SectionIndex } from '@/components/ui/SectionIndex';
import { KineticHeading } from '@/components/ui/KineticHeading';

export function Consultations() {
  const { consultations } = useSiteData();
  const reduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalId, setModalId] = useState<string | null>(null);
  const [lockedByClick, setLockedByClick] = useState(false);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const auraRef = useRef<HTMLDivElement | null>(null);

  const activeOption = consultations.options[activeIndex] ?? consultations.options[0];
  const modalOption = useMemo(
    () => consultations.options.find((o) => o.id === modalId) ?? null,
    [consultations.options, modalId]
  );

  useEffect(() => {
    if (reduced || !sectionRef.current) return;
    registerGsap();

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;
      const isDesktop = window.innerWidth >= 1024;

      if (auraRef.current) {
        gsap.fromTo(
          auraRef.current,
          { scale: 0.65, opacity: 0.25 },
          {
            scale: 1.35,
            opacity: 0.85,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'bottom 20%',
              scrub: true,
            },
          }
        );
      }

      if (isDesktop) {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 10%',
          end: '+=720',
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (lockedByClick) return;
            const p = self.progress;
            const nextIdx = p < 0.34 ? 0 : p < 0.67 ? 1 : 2;
            setActiveIndex((prev) => (prev === nextIdx ? prev : nextIdx));
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced, lockedByClick]);

  useEffect(() => {
    if (!modalOption) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalId(null);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOption]);

  const closeModal = () => {
    setModalId(null);
    triggerRef.current?.focus();
  };

  return (
    <section
      id="consultations"
      ref={sectionRef}
      aria-labelledby="consultations-heading"
      className="relative bg-transparent min-h-[calc(100vh-3rem)] flex flex-col justify-center py-12 sm:py-16 border-b border-[var(--hairline)] overflow-hidden"
    >
      <div
        ref={auraRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] rounded-full bg-gradient-to-tr from-[#60a5fa]/16 via-[#93c5fd]/8 to-transparent blur-[120px] will-change-transform"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1140px] px-5 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <SectionIndex index="02" label="STUDENT CONSULTATIONS" className="mb-3" />
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400 mb-3">
            {consultations.eyebrow}
          </p>
          <KineticHeading
            id="consultations-heading"
            text={consultations.headline}
            className="text-3xl sm:text-5xl font-semibold tracking-[-0.045em] text-white"
          />
          <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto">
            {consultations.subcopy}
          </p>
        </div>

        {/* Apple-style Interactive Split Stage: Vertical Pill Stack Left + Live Morphing Spec Panel Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          <div className="lg:col-span-5 flex flex-col gap-3">
            {consultations.options.map((opt, idx) => {
              const isActive = activeIndex === idx;
              return (
                <motion.button
                  key={opt.id}
                  type="button"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 480, damping: 24 }}
                  onClick={(e) => {
                    triggerRef.current = e.currentTarget;
                    setActiveIndex(idx);
                    setLockedByClick(true);
                  }}
                  aria-expanded={isActive}
                  className={`relative w-full flex items-center justify-between gap-4 px-5 py-4 rounded-2xl border text-left transition-colors duration-300 cursor-pointer ${
                    isActive
                      ? 'text-[#09090b] border-[#faf8f2]'
                      : 'bg-[#121215]/90 text-white border-white/[0.1] hover:border-white/25 hover:bg-white/[0.04]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="consult-active-pill"
                      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                      className="absolute inset-0 rounded-2xl bg-white shadow-[0_0_35px_rgba(230,201,139,0.16)] -z-0"
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-3">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full border ${
                        isActive
                          ? 'border-black/20 bg-[#03060c] text-white'
                          : 'border-white/15 bg-white/5 text-slate-300'
                      }`}
                      aria-hidden="true"
                    >
                      {isActive ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </span>
                    <span className="text-sm font-medium tracking-tight">{opt.label}</span>
                  </div>
                  <span
                    className={`relative z-10 text-[11px] font-mono ${
                      isActive ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeOption.id}
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -14, scale: 0.98 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-3xl bg-[#121215]/80 backdrop-blur-md border border-white/[0.12] p-7 sm:p-8 shadow-2xl"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-20 right-0 w-72 h-36 rounded-full bg-[rgba(96,165,250,0.18)] blur-3xl"
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-[#60a5fa]/15 border border-[#93c5fd]/30 text-[11px] font-mono text-[#93c5fd]">
                      {activeOption.badge}
                    </span>
                    <button
                      type="button"
                      onClick={() => setModalId(activeOption.id)}
                      className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Expand modal ↗
                    </button>
                  </div>

                  <h3 className="text-2xl font-semibold text-white tracking-[-0.03em]">
                    {activeOption.label}
                  </h3>
                  <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                    {activeOption.summary}
                  </p>

                  <div className="mt-5 rounded-2xl bg-[#03060c]/60 border border-white/[0.08] p-4">
                    <ul className="space-y-2">
                      {activeOption.deliverables.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-slate-200">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#e6c98b] shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <span className="font-mono text-[11px] text-slate-400">
                      {activeOption.turnaround}
                    </span>
                    <motion.a
                      whileHover={{ y: -1.5, scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 480, damping: 22 }}
                      href={consultations.formUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#03060c] text-xs font-semibold hover:bg-[#f3ecd8] transition-colors"
                    >
                      <span>Request a consultation</span>
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modalOption && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={closeModal}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="consult-modal-title"
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.94 }}
              transition={{ duration: 0.56, ease: [0.34, 1.56, 0.64, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative overflow-hidden w-full max-w-lg rounded-3xl bg-[#111113]/95 backdrop-blur-2xl border border-white/[0.12] p-7 sm:p-8 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] text-left"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-40 rounded-full bg-[#d9b56d]/30 blur-3xl opacity-45"
              />
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <span className="inline-block px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/25 text-[11px] font-mono text-amber-300 mb-3">
                    {modalOption.badge}
                  </span>
                  <h3
                    id="consult-modal-title"
                    className="text-2xl font-semibold text-white tracking-tight"
                  >
                    {modalOption.label}
                  </h3>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={closeModal}
                  className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.14] text-zinc-300 transition-colors cursor-pointer"
                  aria-label="Close consultation details"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="relative z-10 mt-4 text-sm text-zinc-300 leading-relaxed">
                {modalOption.summary}
              </p>

              <div className="relative z-10 mt-6 rounded-2xl bg-black/50 border border-white/[0.08] p-4">
                <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 mb-3">
                  Consultation Scope
                </p>
                <ul className="space-y-2.5">
                  {modalOption.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-200">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative z-10 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-xs text-zinc-400">{modalOption.turnaround}</span>
                <a
                  href={consultations.formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-all"
                >
                  <span>Request a consultation</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
