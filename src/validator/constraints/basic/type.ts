import type { ConstraintContext, ConstraintOptions, Violation } from '../../types';

const DEFAULT_MESSAGE = 'This value should be of type {type}.';

export type TypeOptions = ConstraintOptions & {
  type: string | string[];
  message?: string;
};

export function type(value: unknown, context: ConstraintContext): Violation[] {
  const options = context.options as TypeOptions;
  const expectedTypes = Array.isArray(options.type) ? options.type : [options.type];

  if (value === undefined) {
    return [];
  }

  if (expectedTypes.includes(getValueType(value))) {
    return [];
  }

  return [
    {
      path: context.path,
      constraint: context.constraint,
      message: options.message ?? DEFAULT_MESSAGE.replace('{type}', formatExpectedTypes(expectedTypes)),
      value,
    },
  ];
}

function getValueType(value: unknown): string {
  if (value === null) {
    return 'null';
  }

  if (Array.isArray(value)) {
    return 'array';
  }

  return typeof value;
}

function formatExpectedTypes(expectedTypes: string[]): string {
  return expectedTypes.join(' or ');
}
