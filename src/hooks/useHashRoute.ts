import { useCallback, useEffect, useState } from 'react';
import type { Opportunity } from '@/data/schema';

export function parseHash(hash: string, opportunities: Opportunity[]): string | null {
  const match = /^#opp\/([a-z0-9-]+)$/i.exec(hash.trim());
  if (!match) return null;
  const id = match[1];
  return opportunities.some((o) => o.id === id) ? id : null;
}

export function useHashRoute(opportunities: Opportunity[]) {
  const [activeOppId, setActiveOppId] = useState<string | null>(() =>
    typeof window === 'undefined' ? null : parseHash(window.location.hash, opportunities)
  );

  useEffect(() => {
    const onHash = () => {
      setActiveOppId(parseHash(window.location.hash, opportunities));
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [opportunities]);

  const openOpp = useCallback((id: string) => {
    const next = `#opp/${id}`;
    if (window.location.hash !== next) {
      window.location.hash = next;
    } else {
      setActiveOppId(id);
    }
  }, []);

  const closeOpp = useCallback(() => {
    if (window.location.hash.startsWith('#opp/')) {
      history.pushState(null, '', window.location.pathname + window.location.search);
    }
    setActiveOppId(null);
  }, []);

  return { activeOppId, openOpp, closeOpp };
}
