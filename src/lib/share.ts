import type { Opportunity } from '@/data/schema';

export function opportunityShareLink(opp: Opportunity): string {
  if (typeof window === 'undefined') return `https://nextstephyderabad.netlify.app/#opp/${opp.id}`;
  return `${window.location.origin}${window.location.pathname}#opp/${opp.id}`;
}

export function whatsappShareUrl(opp: Opportunity): string {
  const link = opportunityShareLink(opp);
  const text = `${opp.title} (${opp.eligibility}) — ${link}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export async function shareOpportunity(opp: Opportunity): Promise<'shared' | 'copied'> {
  const url = opportunityShareLink(opp);
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: opp.title,
        text: `${opp.title} · ${opp.eligibility}`,
        url,
      });
      return 'shared';
    } catch {
      // fall through to clipboard
    }
  }
  await navigator.clipboard.writeText(url);
  return 'copied';
}
