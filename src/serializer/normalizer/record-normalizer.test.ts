import { describe, expect, it, vi } from 'vitest';
import { createRecordNormalizer } from '#koala/serializer/normalizer/record-normalizer';
import type { NormalizerContext } from '#koala/serializer/normalizer/types';

describe('Record normalizer', () => {
  it('should return undefined for non records', () => {
    const normalizer = vi.fn().mockImplementation((value: unknown) => value);
    const recordNormalizer = createRecordNormalizer(normalizer);

    expect(recordNormalizer(42)).toBeUndefined();
    expect(recordNormalizer('not a record')).toBeUndefined();
    expect(recordNormalizer([])).toBeUndefined();
    expect(normalizer).not.toHaveBeenCalled();
  });

  it('should normalize object values recursively', () => {
    const normalizer = vi.fn().mockImplementation((value: unknown) => value);
    const recordNormalizer = createRecordNormalizer(normalizer);
    const input = { a: 1, b: { c: 2 }, d: [3, 4] };

    const result = recordNormalizer(input);

    expect(result).toEqual({ a: 1, b: { c: 2 }, d: [3, 4] });
    expect(normalizer).toHaveBeenCalledTimes(3);
  });

  it('should remove ignored properties', () => {
    const normalizer = vi.fn().mockImplementation((value: unknown) => value);
    const recordNormalizer = createRecordNormalizer(normalizer);
    const input = { name: 'Alice', password: '123' };
    const context: NormalizerContext = {
      metadata: { password: { ignore: true } },
    };

    const result = recordNormalizer(input, context);

    expect(result).toEqual({ name: 'Alice' });
  });

  it('should rename props based on metadata', () => {
    const normalizer = vi.fn().mockImplementation((value: unknown) => value);
    const input = { id: 1, name: 'Alice' };
    const context: NormalizerContext = {
      metadata: { id: { serializedName: 'userId' } },
    };
    const recordNormalizer = createRecordNormalizer(normalizer);

    const result = recordNormalizer(input, context);

    expect(result).toEqual({ userId: 1, name: 'Alice' });
  });

  it('should return empty map if no groups matched', () => {
    const normalizer = vi.fn().mockImplementation((value: unknown) => value);
    const input = { id: 1, firstName: 'John', lastName: 'Doe' };
    const recordNormalizer = createRecordNormalizer(normalizer);

    const result = recordNormalizer(input, { groups: ['public'] });

    expect(result).toEqual({});
  });

  it('should return only props of target groups', () => {
    const normalizer = vi.fn().mockImplementation((value: unknown) => value);
    const input = { id: 1, firstName: 'John', lastName: 'Doe', password: 'secret' };
    const metadata = {
      id: { groups: ['read'] },
      firstName: { groups: ['public'] },
      lastName: { groups: ['public'] },
      password: { groups: ['private'] },
    };
    const recordNormalizer = createRecordNormalizer(normalizer);

    const result = recordNormalizer(input, { groups: ['public', 'read'], metadata });

    expect(result).toEqual({ id: 1, firstName: 'John', lastName: 'Doe' });
  });

  it('should prioritize ignore over groups', () => {
    const normalizer = vi.fn().mockImplementation((value: unknown) => value);
    const input = { id: 1, firstName: 'John', lastName: 'Doe', password: 'secret' };
    const metadata = {
      id: { groups: ['public'] },
      password: { groups: ['private'], ignore: true },
    };
    const recordNormalizer = createRecordNormalizer(normalizer);

    const result = recordNormalizer(input, { groups: ['public', 'private'], metadata });

    expect(result).toEqual({ id: 1 });
  });
});
