import { useCallback, useState } from 'react';
import { useSiteData } from '@/context/SiteDataContext';
import type { ScoutResult } from '@/data/schema';
import { scout } from '@/lib/scoutClient';

export function useScout() {
  const { scoutFallback } = useSiteData();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ScoutResult[]>(scoutFallback);
  const [mode, setMode] = useState<'live' | 'curated'>('curated');

  const runSearch = useCallback(
    async (promptText?: string) => {
      const q = (promptText ?? query).trim();
      if (!q) return;
      setQuery(q);
      setLoading(true);
      const res = await scout(q, scoutFallback);
      setResults(res.results);
      setMode(res.mode);
      setLoading(false);
    },
    [query, scoutFallback]
  );

  return { query, setQuery, loading, results, mode, runSearch };
}
