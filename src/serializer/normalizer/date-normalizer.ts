import { type NormalizedValue, type Normalizer } from '@/serializer/normalizer/types';

export const dateNormalizer: Normalizer<unknown, NormalizedValue | undefined> = (
  date: unknown,
): NormalizedValue | undefined => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return undefined;
  }

  return date.getTime();
};
