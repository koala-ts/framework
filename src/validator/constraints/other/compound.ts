import { Violation } from '@/validator/violation';
import { ConstraintContext } from '../../constraint-validator';
import { FieldSchema } from '@/validator/schema';

export function compound(schema: FieldSchema) {
  return function compoundConstraint(value: unknown, context: ConstraintContext): Violation[] {
    return context.runNestedRules(value, schema, context.path);
  };
}
