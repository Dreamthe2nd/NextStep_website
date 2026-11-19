import { describe, expect, it } from 'vitest';
import { getDeadlineStatus, sortByStatus, statusLabel } from './date';
import { localData } from '@/data/provider';

// 18 Nov 2026, 14:00 IST
const NOW = new Date('2026-11-18T08:30:00Z');

describe('getDeadlineStatus', () => {
  it('rolling when no date', () => {
    expect(getDeadlineStatus(null, NOW)).toEqual({ kind: 'rolling' });
  });
  it('closed for past dates', () => {
    expect(getDeadlineStatus('2026-10-22', NOW)).toEqual({ kind: 'closed' });
  });
  it('open beyond 7 days', () => {
    expect(getDeadlineStatus('2026-12-01', NOW)).toEqual({ kind: 'open', daysLeft: 13 });
  });
  it('closing-soon at exactly 7 days', () => {
    expect(getDeadlineStatus('2026-11-25', NOW)).toEqual({ kind: 'closing-soon', daysLeft: 7 });
  });
  it('open until 23:59 IST on deadline day', () => {
    const lateIST = new Date('2026-11-18T18:00:00Z'); // 23:30 IST
    expect(getDeadlineStatus('2026-11-18', lateIST)).toEqual({ kind: 'closing-soon', daysLeft: 0 });
    const afterIST = new Date('2026-11-18T18:31:00Z'); // 00:01 IST next day
    expect(getDeadlineStatus('2026-11-18', afterIST)).toEqual({ kind: 'closed' });
  });
  it('labels', () => {
    expect(statusLabel({ kind: 'closing-soon', daysLeft: 0 })).toBe('Closes today');
    expect(statusLabel({ kind: 'open', daysLeft: 12 })).toBe('Closes in 12 days');
  });
});

describe('sortByStatus', () => {
  it('puts rolling before closed for current data', () => {
    const sorted = sortByStatus(localData.opportunities, NOW);
    expect(sorted[0].id).toBe('build-with-us');
    expect(sorted).toHaveLength(6);
  });
});

describe('data integrity', () => {
  it('unique ids and valid ISO dates', () => {
    const ids = localData.opportunities.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const o of localData.opportunities) {
      if (o.deadlineISO) expect(o.deadlineISO).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});
