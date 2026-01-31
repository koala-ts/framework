import { type NormalizedValue, type Normalizer, type NormalizerContext } from '@/serializer/normalizer/types';

type Result = NormalizedValue | undefined;

export function createArrayNormalizer(normalize: Normalizer): Normalizer<unknown, Result> {
  return function arrayNormalizer(value: unknown, context?: NormalizerContext): Result {
    if (Array.isArray(value)) {
      return value.map(item => normalize(item, context));
    }

    return undefined;
  };
}
