import { describe, expect, it } from 'vitest';
import { rankFallback } from './scoutClient';
import { localData } from '@/data/provider';

describe('rankFallback', () => {
  it('ranks IRIS first for ISEF query', () => {
    const res = rankFallback('Science Fairs to ISEF', localData.scoutFallback);
    expect(res[0].name).toContain('IRIS National Fair');
  });

  it('returns full fallback for empty query', () => {
    const res = rankFallback('', localData.scoutFallback);
    expect(res).toHaveLength(localData.scoutFallback.length);
  });
});
