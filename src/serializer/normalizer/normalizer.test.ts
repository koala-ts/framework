import { describe, expect, it } from 'vitest';
import { createNormalizer } from '@/serializer/normalizer/normalizer';

describe('Normalizer', () => {
  it('should normalize plain objects', () => {
    const input = { id: 1, username: 'admin', c: true, age: undefined, roles: ['admin', 'user'] };
    const normalizer = createNormalizer();

    const result = normalizer(input);

    const expected = { id: 1, username: 'admin', c: true, age: null, roles: ['admin', 'user'] };
    expect(result).toEqual(expected);
  });

  it('should allow adding custom normalizers', () => {
    const input = { id: 1, createdAt: new Date('2024-01-01T00:00:00Z') };
    const customDateNormalizer = function (value: unknown): string | undefined {
      if (value instanceof Date) return value.toISOString();
      return undefined;
    };
    const normalizer = createNormalizer([customDateNormalizer]);

    const result = normalizer(input);

    const expected = { id: 1, createdAt: '2024-01-01T00:00:00.000Z' };
    expect(result).toEqual(expected);
  });
});
