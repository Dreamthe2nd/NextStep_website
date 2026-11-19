import site from './site.json';
import opportunities from './opportunities.json';
import consultations from './consultations.json';
import team from './team.json';
import scoutFallback from './scout-fallback.json';
import type { SiteData } from './schema';

/**
 * ============================================================================
 * CMS / API INTEGRATION POINT — the ONLY file to change when adding a backend.
 * ============================================================================
 * Components never import JSON directly; they read via `useSiteData()`.
 * To go headless, replace the body below, e.g.:
 *
 *   const res = await fetch(`${import.meta.env.VITE_CMS_URL}/bootstrap`);
 *   if (!res.ok) return localData;           // graceful fallback
 *   return (await res.json()) as SiteData;   // must satisfy schema.ts
 */
export const localData: SiteData = {
  ...site,
  opportunities,
  consultations,
  team,
  scoutFallback,
} as SiteData;

export async function getSiteData(): Promise<SiteData> {
  return localData;
}
