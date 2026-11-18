import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getSiteData, localData } from '@/data/provider';
import type { SiteData } from '@/data/schema';

const SiteDataContext = createContext<SiteData>(localData);

/** Hydrates from the provider (local JSON today, CMS later). Renders local data instantly. */
export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(localData);
  useEffect(() => {
    let alive = true;
    getSiteData()
      .then((d) => alive && setData(d))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return <SiteDataContext.Provider value={data}>{children}</SiteDataContext.Provider>;
}

export const useSiteData = () => useContext(SiteDataContext);
