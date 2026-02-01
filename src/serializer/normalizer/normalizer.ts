import { createArrayNormalizer } from '@/serializer/normalizer/array-normalizer';
import { dateNormalizer } from '@/serializer/normalizer/date-normalizer';
import { nullNormalizer } from '@/serializer/normalizer/null-normalizer';
import { createRecordNormalizer } from '@/serializer/normalizer/record-normalizer';
import { type NormalizedValue, type Normalizer, type NormalizerContext } from '@/serializer/normalizer/types';

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
