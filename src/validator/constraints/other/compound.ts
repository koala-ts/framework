import type { ConstraintContext, FieldRules } from '../../types';
import { Violation } from '@/validator/violation';

export function compound(rules: FieldRules) {
  return function compoundConstraint(value: unknown, context: ConstraintContext): Violation[] {
    return context.runNestedRules(value, rules, context.path);
  };
}
