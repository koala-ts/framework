import type { ConstraintContext, Violation } from '../../types';

const DEFAULT_MESSAGE = 'This value should not be blank.';

export function notBlank(value: unknown, context: ConstraintContext): Violation[] {
  const message = typeof context.options.message === 'string' ? context.options.message : DEFAULT_MESSAGE;

  const normalizedValue =
    typeof value === 'string' && typeof context.options.normalizer === 'function'
      ? context.options.normalizer(value)
      : value;

  if (isBlank(normalizedValue)) {
    return [
      {
        path: context.path,
        constraint: context.constraint,
        message,
        value,
      },
    ];
  }

  return [];
}

function isBlank(value: unknown): boolean {
  return value === '' || value === null || value === undefined || (Array.isArray(value) && value.length === 0);
}
