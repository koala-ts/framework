import type { ConstraintContext } from '@/validator/constraint-validator';
import type { FieldSchema } from '@/validator/schema';
import type { Violation } from '@/validator/violation';

export function compound(schema: FieldSchema) {
  return function compoundConstraint(value: unknown, context: ConstraintContext): Violation[] {
    return context.runNestedRules(value, schema, context.path);
  };
}
