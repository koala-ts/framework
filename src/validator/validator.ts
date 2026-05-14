import { Violation } from './violation';
import { Payload } from './payload';
import { FieldRules } from './constraint';

type Options = { groups?: string[] };

export type ValidationRules = {
  [field: string]: FieldRules;
};

export type Validator = (payload: Payload, rules: ValidationRules, options?: Options) => Violation[];
