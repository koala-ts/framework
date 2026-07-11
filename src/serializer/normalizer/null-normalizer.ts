import type { Normalizer } from '@/serializer/normalizer/types';

export const nullNormalizer: Normalizer<unknown, null | undefined> = (input: unknown): null | undefined => {
  if (undefined === input || null === input) return null;

  return undefined;
};
