import { Violation } from './violation';
import { Payload } from './payload';
import { Options } from '@/validator/options';

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

export type FieldRuleEntry = string | Record<string, ConstraintOptions>;

export type FieldRules = Record<string, ConstraintOptions> | FieldRuleEntry[];

export type ValidationRules = Record<string, FieldRules>;

export type Validator = (payload: Payload, rules: ValidationRules, options?: Options) => Violation[];
