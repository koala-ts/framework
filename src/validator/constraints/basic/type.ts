import { ConstraintOptions } from '@/validator/constraint';
import { ConstraintContext } from '@/validator/constraint-validator';
import { Violation } from '@/validator/violation';

const DEFAULT_MESSAGE = 'This value should be of type {type}.';

export type TypeOptions = ConstraintOptions & {
  type: string | string[];
  message?: string;
};

export function type(value: unknown, context: ConstraintContext<TypeOptions>): Violation[] {
  if (value === undefined) {
    return [];
  }

  const options = context.options;
  const expectedTypes = Array.isArray(options.type) ? options.type : [options.type];

  if (matchesExpectedType(value, expectedTypes)) return [];

  return [
    {
      path: context.path,
      message: options.message ?? getDefaultMessageWith(expectedTypes),
      constraint: context.constraint,
      value,
    },
  ];
}

function matchesExpectedType(value: unknown, expectedTypes: string[]): boolean {
  return expectedTypes.includes(getValueType(value));
}

function getValueType(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function getDefaultMessageWith(expectedTypes: string[]): string {
  return DEFAULT_MESSAGE.replace('{type}', expectedTypes.join(' or '));
}
