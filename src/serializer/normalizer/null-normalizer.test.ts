import { describe, expect, it } from 'vitest';
import { nullNormalizer } from '@/serializer/normalizer/null-normalizer';

describe('Null normalizer', () => {
  it('should normalize undefined to null', () => {
    expect(nullNormalizer(undefined)).toBeNull();
  });

  it('should normalize null to null', () => {
    expect(nullNormalizer(null)).toBeNull();
  });

  it('should return undefined otherwise', () => {
    expect(nullNormalizer(0)).toBeUndefined();
    expect(nullNormalizer('')).toBeUndefined();
    expect(nullNormalizer(false)).toBeUndefined();
    expect(nullNormalizer({})).toBeUndefined();
    expect(nullNormalizer([])).toBeUndefined();
  });
});
