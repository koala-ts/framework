import type { NormalizedValue, Normalizer, NormalizerContext } from '#koala/serializer/normalizer/types';

type Result = NormalizedValue | undefined;

export function createArrayNormalizer(normalize: Normalizer): Normalizer<unknown, Result> {
  return function arrayNormalizer(value: unknown, context?: NormalizerContext): Result {
    if (Array.isArray(value)) {
      return value.map(item => normalize(item, context));
    }

    return undefined;
  };
}
