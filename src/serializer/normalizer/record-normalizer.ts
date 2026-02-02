import { type NormalizedRecord, type Normalizer, type NormalizerContext } from '@/serializer/normalizer/types';

type Result = NormalizedRecord | undefined;

export function createRecordNormalizer(normalize: Normalizer): Normalizer<unknown, Result> {
  return function recordNormalizer(value: unknown, context?: NormalizerContext): Result {
    if (!isRecord(value)) {
      return undefined;
    }

    const normalizedRecord: NormalizedRecord = {};

    const shouldHandleGroups = undefined !== context?.groups && context.groups.length > 0;
    const activeGroups = new Set(context?.groups ?? []);

    for (const [key, val] of Object.entries(value)) {
      const rule = context?.metadata?.[key];

      if (rule?.ignore === true) continue;

      if (shouldHandleGroups) {
        const propGroups = rule?.groups ?? [];
        const hasMatchingGroup = propGroups.some(group => activeGroups.has(group));
        if (!hasMatchingGroup) continue;
      }

      normalizedRecord[rule?.serializedName ?? key] = isRecord(val)
        ? normalize(val, createNestedContext(key, context))
        : normalize(val);
    }

    return normalizedRecord;
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date);
}

function createNestedContext(key: string, parentContext?: NormalizerContext): NormalizerContext | undefined {
  if (undefined === parentContext) return undefined;

  const metadata = parentContext.metadata?.[key]?.metadata;
  if (undefined === metadata) return parentContext;

  return {
    ...parentContext,
    metadata,
  };
}
