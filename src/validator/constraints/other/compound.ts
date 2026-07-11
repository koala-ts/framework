import type { ConstraintContext } from '#koala/validator/constraint-validator';
import type { FieldSchema } from '#koala/validator/schema';
import type { Violation } from '#koala/validator/violation';

export function compound(schema: FieldSchema) {
  return function compoundConstraint(value: unknown, context: ConstraintContext): Violation[] {
    return context.runNestedRules(value, schema, context.path);
  };
}
