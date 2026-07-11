import type { ConstraintOptions } from './constraint';
import type { FieldSchema } from './schema';
import type { Violation } from './violation';

export type ConstraintContext<TOptions extends ConstraintOptions<object> = ConstraintOptions> = {
  path: string;
  root: unknown;
  value: unknown;
  constraint: string;
  options: TOptions;
  runNestedRules: (value: unknown, schema: FieldSchema, path: string) => Violation[];
};

export type ConstraintValidator<TOptions extends ConstraintOptions<object> = ConstraintOptions> = (
  value: unknown,
  context: ConstraintContext<TOptions>,
) => Violation[];
