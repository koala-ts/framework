import { ConstraintOptions } from '@/validator/constraint';
import { ConstraintContext } from '@/validator/constraint-validator';
import { FieldSchema } from '@/validator/schema';
import { Violation } from '@/validator/violation';

const NOT_ARRAY_MESSAGE = 'This value must be a list.';

export type AllOptions = ConstraintOptions<{
  constraints: FieldSchema;
}>;

const createViolation = (value: unknown, context: ConstraintContext<AllOptions>): Violation => ({
  path: context.path,
  constraint: context.constraint,
  message: NOT_ARRAY_MESSAGE,
  value,
});

const createElementPath = (path: string, index: number): string => `${path}[${index}]`;

export function all(value: unknown, context: ConstraintContext<AllOptions>): Violation[] {
  if (value === undefined) return [];

  if (!Array.isArray(value)) return [createViolation(value, context)];

  return value.flatMap((element, index) =>
    context.runNestedRules(element, context.options.constraints, createElementPath(context.path, index)),
  );
}
