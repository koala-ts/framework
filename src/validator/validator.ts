import type {
  ConstraintContext,
  ConstraintValidator,
  FieldRules,
  Payload,
  ValidationRules,
  Validator,
  ValidatorOptions,
} from './types';

export const createValidator = (options: ValidatorOptions): Validator => {
  const { constraints } = options;

  return function validate(payload: Payload, rules: ValidationRules) {
    return Object.entries(rules).flatMap(fieldEntry => applyFieldRules(constraints, payload, fieldEntry as FieldEntry));
  };
};

function resolveConstraint(
  constraints: ValidatorOptions['constraints'],
  field: string,
  constraintName: string,
): ConstraintValidator {
  const constraintValidator = constraints[constraintName];

  if (!constraintValidator) {
    throw new Error(`Field "${field}" references unregistered constraint "${constraintName}".`);
  }

  return constraintValidator;
}

function applyConstraint(
  constraintValidator: ConstraintValidator,
  payload: Payload,
  field: string,
  constraintName: string,
  value: unknown,
): ReturnType<ConstraintValidator> {
  const context: ConstraintContext = {
    path: field,
    root: payload,
    value,
    constraint: constraintName,
  };

  return constraintValidator(value, context);
}

type FieldEntry = [string, FieldRules];

function applyFieldRules(
  constraints: ValidatorOptions['constraints'],
  payload: Payload,
  [field, fieldRules]: FieldEntry,
): ReturnType<ConstraintValidator> {
  const value = payload[field];

  return Object.keys(fieldRules).flatMap(constraintName => {
    const constraintValidator = resolveConstraint(constraints, field, constraintName);
    return applyConstraint(constraintValidator, payload, field, constraintName, value);
  });
}
