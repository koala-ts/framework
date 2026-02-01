import { type NormalizedRecord, type Normalizer, type NormalizerContext } from '@/serializer/normalizer/types';

type Result = NormalizedRecord | undefined;

export function createRecordNormalizer(normalize: Normalizer): Normalizer<unknown, Result> {
  return function recordNormalizer(value: unknown, context?: NormalizerContext): Result {
    if (typeof value !== 'object' || value === null || value instanceof Date || Array.isArray(value)) {
      return undefined;
    }

    const obj = value as Record<string, unknown>;
    const normalizedRecord: NormalizedRecord = {};

    const shouldHandleGroups = undefined !== context?.groups && context.groups.length > 0;
    const activeGroups = new Set(context?.groups ?? []);

    for (const [key, val] of Object.entries(obj)) {
      const rule = context?.metadata?.[key];

      if (rule?.ignore === true) continue;

      if (shouldHandleGroups) {
        const propGroups = rule?.groups ?? [];
        const hasMatchingGroup = propGroups.some(group => activeGroups.has(group));
        if (!hasMatchingGroup) continue;
      }

      normalizedRecord[rule?.serializedName ?? key] = normalize(val, context);
    }

    return normalizedRecord;
  };
}
