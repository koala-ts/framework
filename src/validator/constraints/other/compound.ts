import type { ConstraintContext, FieldRules, Violation } from '../../types';

type CompoundOptions = {
  constraints?: FieldRules;
};

export function compound(value: unknown, context: ConstraintContext): Violation[] {
  const options = context.options as CompoundOptions;
  const constraints = options.constraints;

  if (!constraints || typeof constraints !== 'object') {
    throw new Error('Compound constraint requires constraints to be defined.');
  }

  return context.applyConstraints(value, constraints, context.path);
}
