import type { DeadlineStatus, Opportunity } from '@/data/schema';

const DAY_MS = 86_400_000;
/** IST is UTC+05:30 with no DST. */
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
export const CLOSING_SOON_DAYS = 7;

/** Epoch ms for 23:59:59.999 IST on the given YYYY-MM-DD. */
export function istEndOfDay(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number);
  return Date.UTC(y, m - 1, d, 23, 59, 59, 999) - IST_OFFSET_MS;
}

/** Calendar-day index in IST (for whole-day differences). */
function istDayIndex(ms: number): number {
  return Math.floor((ms + IST_OFFSET_MS) / DAY_MS);
}

export function getDeadlineStatus(iso: string | null, now: Date = new Date()): DeadlineStatus {
  if (!iso) return { kind: 'rolling' };
  const end = istEndOfDay(iso);
  const t = now.getTime();
  if (t > end) return { kind: 'closed' };
  const daysLeft = istDayIndex(end) - istDayIndex(t);
  return daysLeft <= CLOSING_SOON_DAYS ? { kind: 'closing-soon', daysLeft } : { kind: 'open', daysLeft };
}

export function statusLabel(s: DeadlineStatus): string {
  switch (s.kind) {
    case 'rolling':
      return 'Rolling';
    case 'closed':
      return 'Closed — check for next cycle';
    case 'closing-soon':
      return s.daysLeft === 0 ? 'Closes today' : `Closing soon · ${s.daysLeft}d`;
    case 'open':
      return `Closes in ${s.daysLeft} days`;
  }
}

export const isOpen = (s: DeadlineStatus) => s.kind !== 'closed';

const RANK: Record<DeadlineStatus['kind'], number> = { 'closing-soon': 0, open: 1, rolling: 2, closed: 3 };

/** Open-first: closing-soon → open (soonest first) → rolling → closed. Stable. */
export function sortByStatus(items: Opportunity[], now: Date = new Date()): Opportunity[] {
  return items
    .map((o, i) => ({ o, i, s: getDeadlineStatus(o.deadlineISO, now) }))
    .sort((a, b) => {
      const r = RANK[a.s.kind] - RANK[b.s.kind];
      if (r) return r;
      const da = 'daysLeft' in a.s ? a.s.daysLeft : 0;
      const db = 'daysLeft' in b.s ? b.s.daysLeft : 0;
      return da - db || a.i - b.i;
    })
    .map((x) => x.o);
}
