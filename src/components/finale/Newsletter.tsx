import { ArrowUpRight } from 'lucide-react';
import { useSiteData } from '@/context/SiteDataContext';

export function Newsletter() {
  const { meta } = useSiteData();
  if (!meta.newsletterFormUrl) return null;

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 pb-12">
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">
            Opportunity Alerts
          </p>
          <p className="text-lg font-semibold text-zinc-950 mt-1">
            Get new opportunities first
          </p>
        </div>
        <a
          href={meta.newsletterFormUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors self-start sm:self-auto"
        >
          <span>Subscribe</span>
          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
