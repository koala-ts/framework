import { Violation } from '@/validator/violation';
import { FieldRules } from '@/validator/types';

export type ConstraintOptions = { groups?: string[] } & Record<string, unknown>;
export type ConstraintContext = {
  path: string;
  root: unknown;
  value: unknown;
  constraint: string;
  options: ConstraintOptions;
  runNestedRules: (value: unknown, rules: FieldRules, path: string) => Violation[];
};
export type ConstraintValidator = (value: unknown, context: ConstraintContext) => Violation[];
