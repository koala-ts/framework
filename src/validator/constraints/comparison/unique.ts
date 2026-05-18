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

  if (context.options.fields === undefined) {
    const normalized = normalizer ? value.map(element => normalizer(element)) : value;
    if (isUnique(serializedValues(normalized))) return [];
  }

  if (hasUniqueValues(value, context.options.fields, normalizer)) return [];

  return [
    {
      path: context.path,
      constraint: context.constraint,
      message: context.options.message ?? DEFAULT_MESSAGE,
      value,
    },
  ];
}

function hasUniqueValues(
  value: Record<string, unknown>[] | unknown[],
  fields: string[] | undefined,
  normalizer?: ((value: unknown) => unknown) | undefined,
): boolean {
  let normalizedValues: unknown[] | unknown[][];

  if (Array.isArray(fields) && fields.length > 0) {
    const fieldsValues = getFieldsValues(value, fields);
    normalizedValues = normalizeFieldsValues(fieldsValues, normalizer);
  } else {
    normalizedValues = normalizeFieldsValues(value, normalizer);
  }

  return isUnique(serializedValues(normalizedValues));
}

function getFieldsValues(arrayElements: Record<string, unknown>[], fieldNames: string[]): unknown[][] {
  return arrayElements.map(arrayElement => fieldNames.map(fieldName => getFieldValue(arrayElement, fieldName)));

  function getFieldValue(arrayElement: Record<string, unknown>, fieldName: string): unknown {
    return typeof arrayElement === 'object' && arrayElement !== null ? arrayElement[fieldName] : undefined;
  }
}

function normalizeFieldsValues<TValue>(
  fieldsValues: TValue[] | TValue[][],
  normalizer?: (value: TValue) => TValue,
): TValue[] | TValue[][] {
  if (typeof normalizer !== 'function') {
    return fieldsValues;
  }

  if (fieldsValues.every(fieldValue => Array.isArray(fieldValue))) {
    return fieldsValues.map(fieldValues => fieldValues.map(fieldValue => normalizer(fieldValue as TValue)));
  }

  return fieldsValues.map(fieldValue => normalizer(fieldValue as TValue));
}

function serializedValues(values: unknown[] | unknown[][]): unknown[] {
  if (values.every(value => Array.isArray(value))) {
    return values.map(value => JSON.stringify(value));
  }

  return values;
}

function isUnique(value: unknown[]): boolean {
  return new Set(value).size === value.length;
}
