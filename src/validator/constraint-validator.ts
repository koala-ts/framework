import { Violation } from './violation';
import { ConstraintOptions } from './constraint';
import { FieldSchema } from './schema';

export type ConstraintContext<TOptions extends ConstraintOptions = ConstraintOptions> = {
  path: string;
  root: unknown;
  value: unknown;
  constraint: string;
  options: TOptions;
  runNestedRules: (value: unknown, schema: FieldSchema, path: string) => Violation[];
};

export type ConstraintValidator = (value: unknown, context: ConstraintContext) => Violation[];
