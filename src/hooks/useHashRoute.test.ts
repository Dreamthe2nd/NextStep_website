import { describe, expect, it } from 'vitest';
import { parseHash } from './useHashRoute';
import { localData } from '@/data/provider';

describe('parseHash', () => {
  it('resolves valid #opp/<id>', () => {
    expect(parseHash('#opp/birdspiracy-2026', localData.opportunities)).toBe('birdspiracy-2026');
  });

  it('returns null for unknown ids or unrelated hashes', () => {
    expect(parseHash('#opp/does-not-exist', localData.opportunities)).toBeNull();
    expect(parseHash('#opportunities', localData.opportunities)).toBeNull();
  });
});
