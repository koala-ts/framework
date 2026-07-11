import type { NormalizedValue, Normalizer } from '@/serializer/normalizer/types';

type Result = NormalizedValue | undefined;

export const dateNormalizer: Normalizer<unknown, Result> = (date: unknown): Result => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
};
