export interface AmbientStar {
  nx: number;
  ny: number;
  r: number;
  phase: number;
  speed: number;
}

let cachedStars: AmbientStar[] | null = null;

/** Shared ambient starfield coordinates for hero constellation layer. */
export function getSharedStars(count = 120): AmbientStar[] {
  if (cachedStars) return cachedStars;
  let seed = 4219;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  cachedStars = Array.from({ length: count }, () => ({
    nx: rand(),
    ny: rand(),
    r: rand() * 1.4 + 0.3,
    phase: rand() * Math.PI * 2,
    speed: rand() * 0.025 + 0.008,
  }));
  return cachedStars;
}
