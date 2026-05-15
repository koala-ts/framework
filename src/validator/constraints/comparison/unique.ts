import { ConstraintContext } from '@/validator/constraint-validator';

const DEFAULT_MESSAGE = 'This collection should contain only unique elements.';

export function unique(value: unknown, context: ConstraintContext) {
  if (Array.isArray(value) && new Set(value).size !== value.length) {
    return [
      {
        path: context.path,
        constraint: context.constraint,
        message: DEFAULT_MESSAGE,
        value,
      },
    ];
  }

  return [];
}
