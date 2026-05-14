import { Violation } from './violation';

export type ConstraintOptions = {
  groups?: string[];
  [key: string]: unknown;
};

type FieldRuleEntry = string | Record<string, ConstraintOptions>;
export type FieldRules = Record<string, ConstraintOptions> | FieldRuleEntry[];

export type ConstraintContext = {
  path: string;
  root: unknown;
  value: unknown;
  constraint: string;
  options: ConstraintOptions;
  runNestedRules: (value: unknown, rules: FieldRules, path: string) => Violation[];
};
export type ConstraintValidator = (value: unknown, context: ConstraintContext) => Violation[];
