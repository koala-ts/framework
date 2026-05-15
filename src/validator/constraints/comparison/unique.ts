import { ConstraintOptions } from '@/validator/constraint';
import { ConstraintContext } from '@/validator/constraint-validator';

const DEFAULT_MESSAGE = 'This collection should contain only unique elements.';

type UniqueOptions = ConstraintOptions & {
  message?: string;
  normalizer?: (value: unknown) => unknown;
};

export function unique(value: unknown, context: ConstraintContext<UniqueOptions>) {
  const message = context.options.message ?? DEFAULT_MESSAGE;

  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value)) {
    return [
      {
        path: context.path,
        constraint: context.constraint,
        message,
        value,
      },
    ];
  }

  const normalizedValue = normalizeElements(value, context.options.normalizer);

  if (!hasUniqueElements(normalizedValue)) {
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

function normalizeElements(value: unknown[], normalizer?: (value: unknown) => unknown): unknown[] {
  if (typeof normalizer !== 'function') {
    return value;
  }

  return value.map(element => normalizer(element));
}

function hasUniqueElements(value: unknown[]): boolean {
  return new Set(value).size === value.length;
}
