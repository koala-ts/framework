import { type Normalizer } from '@/serializer/normalizer/types';

export const nullNormalizer: Normalizer<unknown, null | undefined> = function (input: unknown): null | undefined {
  if (undefined === input || null === input) return null;

  return undefined;
};
