import { createArrayNormalizer } from '#koala/serializer/normalizer/array-normalizer';
import { dateNormalizer } from '#koala/serializer/normalizer/date-normalizer';
import { nullNormalizer } from '#koala/serializer/normalizer/null-normalizer';
import { createRecordNormalizer } from '#koala/serializer/normalizer/record-normalizer';
import type { NormalizedValue, Normalizer, NormalizerContext } from '#koala/serializer/normalizer/types';

type CustomNormalizer = Normalizer<unknown, NormalizedValue | undefined>;

export function createNormalizer(customNormalizer?: CustomNormalizer[]): Normalizer {
  return function normalize(value: unknown, context?: NormalizerContext): NormalizedValue {
    const builtInNormalizers = [
      nullNormalizer,
      dateNormalizer,
      createArrayNormalizer(normalize),
      createRecordNormalizer(normalize),
    ];

    const normalizers = new Set<CustomNormalizer>([...(customNormalizer ?? []), ...builtInNormalizers]);

    for (const normalizer of normalizers) {
      const result = normalizer(value, context);

      if (undefined !== result) return result;
    }

    return value as NormalizedValue;
  };
}
