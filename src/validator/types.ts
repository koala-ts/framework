import { Violation } from './violation';
import { Payload } from './payload';
import { Options } from './options';
import { ConstraintOptions } from './constraint';

export type FieldRuleEntry = string | Record<string, ConstraintOptions>;

export type FieldRules = Record<string, ConstraintOptions> | FieldRuleEntry[];

export type ValidationRules = Record<string, FieldRules>;

export type Validator = (payload: Payload, rules: ValidationRules, options?: Options) => Violation[];
