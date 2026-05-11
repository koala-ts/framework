import type { ConstraintContext, ConstraintOptions, Violation } from '../../types';

const DEFAULT_MESSAGE = 'This value should be of type {type}.';

export type TypeOptions = ConstraintOptions & {
  type: string | string[];
  message?: string;
};

export function type(value: unknown, context: ConstraintContext): Violation[] {
  const options = context.options as TypeOptions;

  return [
    {
      path: context.path,
      constraint: context.constraint,
      message: DEFAULT_MESSAGE.replace('{type}', String(options.type)),
      value,
    },
  ];
}
