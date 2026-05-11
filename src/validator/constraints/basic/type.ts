import type { ConstraintContext, ConstraintOptions, Violation } from '../../types';

export type TypeOptions = ConstraintOptions & {
  type: string | string[];
  message?: string;
};

function typeConstraint(value: unknown, context: ConstraintContext): Violation[] {
  const options = context.options as TypeOptions;

  if (typeof value === options.type) {
    return [];
  }

  return [
    {
      path: context.path,
      constraint: context.constraint,
      message: 'This value should be of type string.',
      value,
    },
  ];
}

export { typeConstraint as type };
