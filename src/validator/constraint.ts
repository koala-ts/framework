import { Violation } from './violation';
import { ConstraintOptions, FieldSchema } from './schema';

export type ConstraintContext = {
  path: string;
  root: unknown;
  value: unknown;
  constraint: string;
  options: ConstraintOptions;
  runNestedRules: (value: unknown, schema: FieldSchema, path: string) => Violation[];
};

export type ConstraintValidator = (value: unknown, context: ConstraintContext) => Violation[];
