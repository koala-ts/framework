import type { ConstraintContext, CreateValidatorOptions, Payload, ValidationRules, Validator } from './types';

export const createValidator = (options: CreateValidatorOptions): Validator => {
  const { constraints } = options;

  return function validate(payload: Payload, rules: ValidationRules) {
    return Object.entries(rules).flatMap(([field, fieldRules]) => {
      const value = payload[field];

      return Object.keys(fieldRules).flatMap(constraintName => {
        const constraintValidator = constraints[constraintName];

        if (!constraintValidator) {
          throw new Error(`Field "${field}" references unregistered constraint "${constraintName}".`);
        }

        const context: ConstraintContext = {
          path: field,
          root: payload,
          value,
          constraint: constraintName,
        };

        return constraintValidator(value, context);
      });
    });
  };
};
