import type { ConstraintContext, FieldRules, Violation } from '../../types';

export function compound(rules: FieldRules) {
  return function compoundConstraint(value: unknown, context: ConstraintContext): Violation[] {
    if (!rules || typeof rules !== 'object') {
      throw new Error('Compound constraint requires constraints to be defined.');
    }

    return context.applyConstraints(value, rules, context.path);
  };
}
