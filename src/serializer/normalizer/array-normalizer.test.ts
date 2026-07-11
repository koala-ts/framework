import { describe, expect, it, vi } from 'vitest';
import { createArrayNormalizer } from '#koala/serializer/normalizer/array-normalizer';

describe('Array normalizer', () => {
  it('should normalize array recursively', () => {
    const normalizer = vi.fn().mockImplementation((value: unknown) => value);
    const arrayNormalizer = createArrayNormalizer(normalizer);
    const input = [1, [2, 3], { a: 4 }];

    const result = arrayNormalizer(input);

    expect(result).toEqual([1, [2, 3], { a: 4 }]);
    expect(normalizer).toHaveBeenCalledTimes(3);
  });

  it('should return undefined otherwise', () => {
    const normalizer = vi.fn();
    const arrayNormalizer = createArrayNormalizer(normalizer);

    expect(arrayNormalizer(42)).toBeUndefined();
    expect(arrayNormalizer('not an array')).toBeUndefined();
    expect(arrayNormalizer({})).toBeUndefined();
    expect(normalizer).not.toHaveBeenCalled();
  });
});
