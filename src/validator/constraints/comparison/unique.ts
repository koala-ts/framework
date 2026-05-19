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

  const fields = context.options.fields;
  const normalizer = context.options.normalizer;
  let normalized: unknown[];

  if (fields !== undefined && fields.length > 0) {
    const fieldsValues = value.map(valueElement => fields.map(field => valueElement[field]));
    const normalizedValues = normalizer
      ? fieldsValues.map(fieldsValues => fieldsValues.map(fieldsValue => normalizer(fieldsValue)))
      : fieldsValues;
    normalized = normalizedValues.map(normalizedValue => JSON.stringify(normalizedValue));
  } else normalized = normalizer ? value.map(element => normalizer(element)) : value;

  if (isUnique(normalized)) return [];

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
