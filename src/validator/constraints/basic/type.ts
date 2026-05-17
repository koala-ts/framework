import { ConstraintOptions } from '@/validator/constraint';
import { ConstraintContext } from '@/validator/constraint-validator';
import { Violation } from '@/validator/violation';

const DEFAULT_MESSAGE = 'This value should be of type {type}.';
const DEFAULT_MESSAGE_FOR_MULTIPLE_TYPES = 'This value should match at least one of these types [{types}].';

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

  const options: TypeOptions = context.options;
  const normalizedTypes: AllowedTypes[] = Array.isArray(options.type) ? options.type : [options.type];

  if (matchesExpectedType(value, normalizedTypes)) return [];

  return [
    {
      path: context.path,
      message: options.message ?? getDefaultMessageWith(normalizedTypes),
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
  if (types.length === 1) {
    return DEFAULT_MESSAGE.replace('{type}', types[0] as string);
  }

  return DEFAULT_MESSAGE_FOR_MULTIPLE_TYPES.replace('{types}', types.join(', '));
}
