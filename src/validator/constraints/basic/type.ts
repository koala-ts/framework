import type { ConstraintOptions } from '#koala/validator/constraint';
import type { ConstraintContext } from '#koala/validator/constraint-validator';
import type { Violation } from '#koala/validator/violation';

const DEFAULT_MESSAGE = 'This value should match at least one of these types [{types}].';

type AllowedType = 'string' | 'number' | 'boolean' | 'bigint' | 'symbol' | 'function' | 'object' | 'array' | 'null';

export type TypeOptions = ConstraintOptions<{
  type: AllowedType | readonly AllowedType[];
  message?: string;
}>;

export function type(value: unknown, context: ConstraintContext<TypeOptions>): Violation[] {
  if (value === undefined) return [];

  const actualType = getTypeOf(value);
  const expectedTypes = getExpectedTypes(context.options.type);

  if (expectedTypes.some(expectedType => actualType === expectedType)) return [];

  return [
    {
      path: context.path,
      message: context.options.message ?? DEFAULT_MESSAGE.replace('{types}', expectedTypes.join(', ')),
      constraint: context.constraint,
      value,
    },
  ];
}

function getTypeOf(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function getExpectedTypes(type: TypeOptions['type']): readonly AllowedType[] {
  return typeof type === 'string' ? [type] : type;
}
