import { Violation } from '@/validator/violation';
import { FieldSchema } from '@/validator/schema';
import { ConstraintContext } from '@/validator/constraint-validator';

export function compound(schema: FieldSchema) {
  return function compoundConstraint(value: unknown, context: ConstraintContext): Violation[] {
    return context.runNestedRules(value, schema, context.path);
  };
}
