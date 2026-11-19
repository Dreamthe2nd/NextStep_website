import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { registerGsap } from '@/lib/motion';

interface KineticHeadingProps {
  id?: string;
  text: string;
  italicTail?: string;
  className?: string;
  italicClassName?: string;
}

/**
 * Cypher Capital / scroll-craft word-staggered masked rise.
 * Uses pb-[0.14em] inside overflow-hidden so descenders (g, y, p) never clip.
 */
export function KineticHeading({
  id,
  text,
  italicTail,
  className = '',
  italicClassName = '',
}: KineticHeadingProps) {
  const ref = useRef<HTMLHeadingElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    registerGsap();

    const ctx = gsap.context(() => {
      const words = ref.current?.querySelectorAll('[data-kh-word]');
      if (!words || words.length === 0) return;

      gsap.fromTo(
        words,
        { yPercent: 115, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'expo.out',
          stagger: 0.055,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 88%',
            once: true,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [reduced]);

  const mainWords = text.trim().split(/\s+/);
  const tailWords = italicTail ? italicTail.trim().split(/\s+/) : [];

  return (
    <h2 id={id} ref={ref} className={className}>
      {mainWords.map((w, i) => (
        <span key={`m-${i}`} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em] mr-[0.26em]">
          <span data-kh-word className="inline-block will-change-transform">
            {w}
          </span>
        </span>
      ))}
      {tailWords.map((w, i) => (
        <span
          key={`t-${i}`}
          className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em] mr-[0.26em] last:mr-0"
        >
          <span
            data-kh-word
            className={`inline-block will-change-transform font-serif italic font-normal tracking-[-0.02em] ${italicClassName}`}
          >
            {w}
          </span>
        </span>
      ))}
    </h2>
  );
}
