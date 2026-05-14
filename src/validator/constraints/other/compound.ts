import { Violation } from '@/validator/violation';
import { ConstraintContext, FieldRules } from '@/validator/constraint';

export function compound(rules: FieldRules) {
  return function compoundConstraint(value: unknown, context: ConstraintContext): Violation[] {
    return context.runNestedRules(value, rules, context.path);
  };
}
