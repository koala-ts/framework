import type { FieldRules } from '../../types';
import { Violation } from '@/validator/violation';
import { ConstraintContext } from '@/validator/constraint';

export function compound(rules: FieldRules) {
  return function compoundConstraint(value: unknown, context: ConstraintContext): Violation[] {
    return context.runNestedRules(value, rules, context.path);
  };
}
