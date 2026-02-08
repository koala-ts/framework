import type { ConstraintContext, FieldRules, Violation } from '../../types';

export function compound(rules: FieldRules) {
  return function compoundConstraint(value: unknown, context: ConstraintContext): Violation[] {
    return context.applyConstraints(value, rules, context.path);
  };
}
