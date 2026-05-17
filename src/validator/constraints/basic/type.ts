import { ConstraintOptions } from '@/validator/constraint';
import { ConstraintContext } from '@/validator/constraint-validator';
import { Violation } from '@/validator/violation';

const DEFAULT_MESSAGE = 'This value should match at least one of these types [{types}].';

export type AllowedType =
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
  type: AllowedType | AllowedType[];
  message?: string;
};

export function type(value: unknown, context: ConstraintContext<TypeOptions>): Violation[] {
  if (value === undefined) {
    return [];
  }

  const normalizedTypes: AllowedType[] = Array.isArray(context.options.type)
    ? context.options.type
    : [context.options.type];

  if (normalizedTypes.includes(getTypeOf(value))) return [];

  return [
    {
      path: context.path,
      message: context.options.message ?? getDefaultMessageWith(normalizedTypes),
      constraint: context.constraint,
      value,
    },
  ];
}

function getTypeOf(value: unknown): AllowedType {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value as AllowedType;
}

function getDefaultMessageWith(types: AllowedType[]): string {
  return DEFAULT_MESSAGE.replace('{types}', types.join(', '));
}
