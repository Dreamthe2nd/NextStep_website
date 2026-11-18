import { describe, expect, it } from 'vitest';
import { buildIcs, googleCalendarUrl } from './calendar';
import { localData } from '@/data/provider';

describe('calendar helpers', () => {
  const opp = localData.opportunities[0]; // Birdspiracy 2026-10-22

  it('builds valid VCALENDAR with VALARM and escaped commas', () => {
    const ics = buildIcs(opp);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('DTSTART;VALUE=DATE:20261022');
    expect(ics).toContain('DTEND;VALUE=DATE:20261023');
    expect(ics).toContain('TRIGGER:-P3D');
    expect(ics).toContain('END:VCALENDAR');
  });

  it('returns null for rolling opportunities', () => {
    const rolling = localData.opportunities.find((o) => o.deadlineISO === null)!;
    expect(buildIcs(rolling)).toBeNull();
    expect(googleCalendarUrl(rolling)).toBeNull();
  });
});
