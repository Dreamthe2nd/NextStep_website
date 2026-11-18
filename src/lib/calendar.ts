import type { Opportunity } from '@/data/schema';

function escapeIcs(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

function nextDayCompact(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + 1));
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(dt.getUTCDate()).padStart(2, '0');
  return `${yy}${mm}${dd}`;
}

export function buildIcs(opp: Opportunity): string | null {
  if (!opp.deadlineISO) return null;
  const start = opp.deadlineISO.replace(/-/g, '');
  const end = nextDayCompact(opp.deadlineISO);

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NextStep Hyderabad//Opportunity Directory//EN',
    'BEGIN:VEVENT',
    `UID:${opp.id}@nextstephyderabad.netlify.app`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${escapeIcs(`Deadline: ${opp.title}`)}`,
    `DESCRIPTION:${escapeIcs(`${opp.copy}\n\nOfficial link: ${opp.url}`)}`,
    'BEGIN:VALARM',
    'TRIGGER:-P3D',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeIcs(`3 days left for ${opp.title}`)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadIcs(opp: Opportunity): void {
  const ics = buildIcs(opp);
  if (!ics) return;
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${opp.id}-deadline.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function googleCalendarUrl(opp: Opportunity): string | null {
  if (!opp.deadlineISO) return null;
  const start = opp.deadlineISO.replace(/-/g, '');
  const end = nextDayCompact(opp.deadlineISO);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Deadline: ${opp.title}`,
    dates: `${start}/${end}`,
    details: `${opp.copy}\n\nOfficial page: ${opp.url}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
