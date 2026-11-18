import { useCallback, useEffect, useState } from 'react';

const KEY = 'nextstep:shortlist:v1';

function readIds(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr.filter((x) => typeof x === 'string')) : new Set();
  } catch {
    return new Set();
  }
}

export function useShortlist() {
  const [savedIds, setSavedIds] = useState<Set<string>>(() =>
    typeof window === 'undefined' ? new Set() : readIds()
  );

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setSavedIds(readIds());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleSave = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(KEY, JSON.stringify([...next]));
      } catch {
        // ignore quota errors
      }
      return next;
    });
  }, []);

  return { savedIds, toggleSave, count: savedIds.size };
}
