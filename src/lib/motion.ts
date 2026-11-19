import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

export function registerGsap(): void {
  if (registered || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export const springPop = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 30,
};

export function maskReveal(
  targets: gsap.TweenTarget,
  opts?: { delay?: number; stagger?: number; y?: number }
): gsap.core.Tween {
  return gsap.fromTo(
    targets,
    {
      yPercent: opts?.y ?? 100,
      opacity: 0,
      clipPath: 'inset(0% 0% 100% 0%)',
    },
    {
      yPercent: 0,
      opacity: 1,
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 0.9,
      ease: 'expo.out',
      stagger: opts?.stagger ?? 0.08,
      delay: opts?.delay ?? 0,
    }
  );
}
