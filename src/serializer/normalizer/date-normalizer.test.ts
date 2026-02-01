import { describe, expect, it } from 'vitest';
import { dateNormalizer } from '@/serializer/normalizer/date-normalizer';

describe('Date normalizer', () => {
  it('should normalize date to ISO string', () => {
    const now = new Date();

    const actual = dateNormalizer(now);

    expect(actual).toBe(now.toISOString());
  });

  it('should return undefined for invalid date', () => {
    const invalidDate = new Date('invalid date string');

    const actual = dateNormalizer(invalidDate);

    expect(actual).toBeUndefined();
  });

  it('should return undefined for non-date input', () => {
    expect(dateNormalizer('2023-01-01')).toBeUndefined();
    expect(dateNormalizer(1672531200000)).toBeUndefined();
    expect(dateNormalizer({})).toBeUndefined();
    expect(dateNormalizer([])).toBeUndefined();
    expect(dateNormalizer(null)).toBeUndefined();
    expect(dateNormalizer(undefined)).toBeUndefined();
  });
});
