/**
 * NextStep Hyderabad — content schema (the UI contract).
 * Any future CMS/API response MUST satisfy `SiteData`.
 */

export type FilterGroup =
  | 'AI & Innovation'
  | 'STEM & Research'
  | 'Entrepreneurship'
  | 'MUN & Leadership'
  | 'Scholarships'
  | 'Community';

export interface Opportunity {
  /** URL-safe slug, used in `#opp/<id>` deep links */
  id: string;
  indexLabel: string;
  title: string;
  /** Verbatim category label, e.g. "AI & innovation" */
  category: string;
  filterGroup: FilterGroup;
  eligibility: string;
  targetClasses: string;
  format: string;
  /** Verbatim deadline text, e.g. "October 22, 2026" or "Open Rolling" */
  deadlineLabel: string;
  /** ISO date (YYYY-MM-DD) for status math; null = rolling */
  deadlineISO: string | null;
  copy: string;
  /** External URL or in-page anchor like "#team" */
  url: string;
  checklist?: string[];
}

export type DeadlineStatus =
  | { kind: 'rolling' }
  | { kind: 'open'; daysLeft: number }
  | { kind: 'closing-soon'; daysLeft: number }
  | { kind: 'closed' };

export interface ScoutResult {
  name: string;
  eligibility: string;
  deadline: string;
  focusAreas: string;
  howToApply: string;
  url?: string;
}

export interface SiteMeta {
  brand: string;
  tagline: string;
  founder: string;
  quote: string;
  instagramUrl: string;
  instagramHandle: string;
  consultationFormUrl: string;
  teamFormUrl: string;
  /** Empty string hides the newsletter block */
  newsletterFormUrl: string;
  siteUrl: string;
}

export interface HeroContent {
  badge: string;
  headlinePrefix: string;
  headlineItalic: string;
  mission: string;
  tickerItems: string[];
}

export interface Pillar {
  id: string;
  title: string;
  description: string;
  metricTag: string;
}

export interface ConsultOption {
  id: string;
  label: string;
  badge: string;
  summary: string;
  deliverables: string[];
  turnaround: string;
}

export interface ConsultationsContent {
  eyebrow: string;
  headline: string;
  subcopy: string;
  formUrl: string;
  options: ConsultOption[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  track: string;
  focus: string;
  status: string;
  image?: string;
  quote?: string;
  motto?: string;
  linkUrl?: string;
  linkLabel?: string;
}

export interface TeamContent {
  eyebrow: string;
  headline: string;
  formUrl: string;
  pillars: { key: string; note: string }[];
  members: TeamMember[];
}

export interface AboutContent {
  eyebrow: string;
  headline: string;
  story: string;
  vision: string;
}

export interface SiteData {
  meta: SiteMeta;
  hero: HeroContent;
  pillars: Pillar[];
  opportunities: Opportunity[];
  consultations: ConsultationsContent;
  team: TeamContent;
  about: AboutContent;
  scoutFallback: ScoutResult[];
}
