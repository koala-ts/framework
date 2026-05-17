import { ConstraintOptions } from '@/validator/constraint';
import { ConstraintContext } from '@/validator/constraint-validator';
import { Violation } from '@/validator/violation';

const DEFAULT_MESSAGE = 'This value should match at least one of these types [{types}].';

export type AllowedTypes =
  | 'string'
  | 'number'
  | 'boolean'
  | 'bigint'
  | 'symbol'
  | 'function'
  | 'object'
  | 'array'
  | 'null';

export type TypeOptions = ConstraintOptions & {
  type: AllowedTypes | AllowedTypes[];
  message?: string;
};

export function type(value: unknown, context: ConstraintContext<TypeOptions>): Violation[] {
  if (value === undefined) {
    return [];
  }

  const normalizedTypes: AllowedTypes[] = Array.isArray(context.options.type)
    ? context.options.type
    : [context.options.type];

  if (matchesExpectedType(value, normalizedTypes)) return [];

  return [
    {
      path: context.path,
      message: context.options.message ?? getDefaultMessageWith(normalizedTypes),
      constraint: context.constraint,
      value,
    },
  ];
}

function matchesExpectedType(value: unknown, expectedTypes: AllowedTypes[]): boolean {
  return expectedTypes.includes(getValueType(value));
}

function getValueType(value: unknown): AllowedTypes {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value as AllowedTypes;
}

function getDefaultMessageWith(types: AllowedTypes[]): string {
  return DEFAULT_MESSAGE.replace('{types}', types.join(', '));
}
