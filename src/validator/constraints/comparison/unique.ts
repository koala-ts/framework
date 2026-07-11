import { isDeepStrictEqual } from 'node:util';
import type { ConstraintOptions } from '@/validator/constraint';
import type { ConstraintContext } from '@/validator/constraint-validator';
import type { Violation } from '@/validator/violation';

const DEFAULT_MESSAGE = 'This value must contain only unique items.';
const NOT_ARRAY_MESSAGE = 'This value must be a list.';
const FIELDS_REQUIRE_OBJECTS_MESSAGE = 'This value must be a list of objects.';

export type UniqueOptions = ConstraintOptions<{
  message?: string;
  normalizer?: (value: unknown) => unknown;
  fields?: string[];
}>;

const createViolation = (value: unknown, context: ConstraintContext, message: string): Violation => ({
  path: context.path,
  constraint: context.constraint,
  message,
  value,
});

const pickFields = (value: Record<string, unknown>, fields: string[]): Record<string, unknown> =>
  Object.fromEntries(fields.map(field => [field, value[field]]));

const normalizeElements = (value: unknown[], normalizer?: (value: unknown) => unknown): unknown[] =>
  normalizer ? value.map(element => normalizer(element)) : value;

const hasConfiguredFields = (fields?: string[]): fields is string[] => fields !== undefined && fields.length > 0;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const containsOnlyRecords = (values: unknown[]): values is Record<string, unknown>[] => values.every(isRecord);

const prepareComparableElements = (value: unknown[], fields?: string[]): unknown[] =>
  hasConfiguredFields(fields) ? value.map(element => pickFields(element as Record<string, unknown>, fields)) : value;

const hasOnlyUniqueValues = (values: unknown[]): boolean =>
  values.every((value, index) =>
    values.every((candidate, candidateIndex) => candidateIndex <= index || !isDeepStrictEqual(value, candidate)),
  );

export function unique(value: unknown, context: ConstraintContext<UniqueOptions>): Violation[] {
  if (value === undefined) return [];

  if (!Array.isArray(value)) return [createViolation(value, context, context.options.message ?? NOT_ARRAY_MESSAGE)];

  const normalizedElements = normalizeElements(value, context.options.normalizer);

  if (hasConfiguredFields(context.options.fields) && !containsOnlyRecords(normalizedElements)) {
    return [createViolation(value, context, context.options.message ?? FIELDS_REQUIRE_OBJECTS_MESSAGE)];
  }

  const comparableElements = prepareComparableElements(normalizedElements, context.options.fields);

  if (hasOnlyUniqueValues(comparableElements)) return [];

  return [createViolation(value, context, context.options.message ?? DEFAULT_MESSAGE)];
}
