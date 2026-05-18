import { ConstraintOptions } from '@/validator/constraint';
import { ConstraintContext } from '@/validator/constraint-validator';
import { Violation } from '@/validator/violation';

const DEFAULT_MESSAGE = 'This collection should contain only unique elements.';

export type UniqueOptions = ConstraintOptions<{
  message?: string;
  normalizer?: (value: unknown) => unknown;
  fields?: string[];
}>;

export function unique(value: unknown, context: ConstraintContext<UniqueOptions>): Violation[] {
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value)) {
    return [
      {
        path: context.path,
        constraint: context.constraint,
        message: context.options.message ?? DEFAULT_MESSAGE,
        value,
      },
    ];
  }

  const normalizer = context.options.normalizer;
  const fields = context.options.fields;

  if (fields === undefined) {
    const normalized = normalizer ? value.map(element => normalizer(element)) : value;
    if (isUnique(normalized)) return [];
  }

  if (fields !== undefined && fields.length > 0) {
    const fieldsValues = value.map(valueElement => fields.map(field => valueElement[field]));
    const normalizedValues = normalizer
      ? fieldsValues.map(fieldsValues => fieldsValues.map(fieldsValue => normalizer(fieldsValue)))
      : value;
    const serialized = normalizedValues.map(normalizedValue => JSON.stringify(normalizedValue));
    if (isUnique(serialized)) return [];
  }

  return [
    {
      path: context.path,
      constraint: context.constraint,
      message: context.options.message ?? DEFAULT_MESSAGE,
      value,
    },
  ];
}

function isUnique(value: unknown[]): boolean {
  return new Set(value).size === value.length;
}
