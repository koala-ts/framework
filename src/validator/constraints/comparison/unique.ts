import { ConstraintOptions } from '@/validator/constraint';
import { ConstraintContext } from '@/validator/constraint-validator';

const DEFAULT_MESSAGE = 'This collection should contain only unique elements.';

type UniqueOptions = ConstraintOptions & {
  message?: string;
};

export function unique(value: unknown, context: ConstraintContext<UniqueOptions>) {
  const message = context.options.message ?? DEFAULT_MESSAGE;

  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value) || !hasUniqueElements(value)) {
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

function hasUniqueElements(value: unknown[]): boolean {
  return new Set(value).size === value.length;
}
