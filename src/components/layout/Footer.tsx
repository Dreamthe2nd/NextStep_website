import { ArrowUpRight } from 'lucide-react';
import { useSiteData } from '@/context/SiteDataContext';

export function Footer() {
  const { meta } = useSiteData();

  return (
    <footer className="border-t border-zinc-200 bg-white text-zinc-950">
      <div className="mx-auto w-full max-w-[1140px] px-5 md:px-8 pt-12 pb-24 sm:pb-16 lg:pr-52 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="text-sm font-semibold text-zinc-950">
            {meta.brand} · {meta.founder}
          </p>
          <p className="text-xs text-zinc-600 mt-1">Discover • Apply • Grow</p>
        </div>

        <div className="flex flex-col sm:items-end gap-1.5 text-xs text-zinc-600">
          <a
            href={meta.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-zinc-950 hover:underline underline-offset-4"
          >
            <span>Instagram: {meta.instagramHandle}</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
          <p>
            Student-led initiative · Hyderabad · Verify official organiser rules before applying.
          </p>
        </div>
      </div>
    </footer>
  );
}
