import { Violation } from './violation';

export type ConstraintOptions = {
  groups?: string[];
  [key: string]: unknown;
};

type ConstraintRule = {
  [constraint: string]: ConstraintOptions;
};

type FieldRule = string | ConstraintRule;

type FieldRuleList = FieldRule[];

type FieldRuleMap = {
  [constraint: string]: ConstraintOptions;
};

export type FieldRules = FieldRuleList | FieldRuleMap;

export type ConstraintContext = {
  path: string;
  root: unknown;
  value: unknown;
  constraint: string;
  options: ConstraintOptions;
  runNestedRules: (value: unknown, rules: FieldRules, path: string) => Violation[];
};

export type ConstraintValidator = (value: unknown, context: ConstraintContext) => Violation[];
