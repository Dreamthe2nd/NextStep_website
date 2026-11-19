import type { ScoutResult } from '@/data/schema';

export function rankFallback(query: string, fallback: ScoutResult[]): ScoutResult[] {
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2);
  if (words.length === 0) return fallback;

  const scored = fallback
    .map((item) => {
      const hay = `${item.name} ${item.eligibility} ${item.focusAreas} ${item.howToApply}`.toLowerCase();
      const score = words.reduce((acc, w) => (hay.includes(w) ? acc + 1 : acc), 0);
      return { item, score };
    })
    .sort((a, b) => b.score - a.score);

  const matched = scored.filter((s) => s.score > 0).map((s) => s.item);
  return matched.length > 0 ? matched : fallback;
}

export async function scout(
  query: string,
  fallback: ScoutResult[]
): Promise<{ mode: 'live' | 'curated'; results: ScoutResult[] }> {
  try {
    const res = await fetch('/api/scout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as ScoutResult[];
    if (!Array.isArray(data) || data.length === 0) throw new Error('empty');
    return { mode: 'live', results: data };
  } catch {
    return { mode: 'curated', results: rankFallback(query, fallback) };
  }
}
