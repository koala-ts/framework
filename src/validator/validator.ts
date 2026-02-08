import { UnknownConstraintError } from './errors';
import {
  ConstraintContext,
  ConstraintOptions,
  ConstraintsMap,
  ConstraintValidator,
  FieldRules,
  Payload,
  ValidateOptions,
  ValidationRules,
  Validator,
  ValidatorOptions,
} from './types';

export const createValidator = (options: ValidatorOptions): Validator => {
  const { constraints } = options;

  return function validate(payload: Payload, rules: ValidationRules, options?: ValidateOptions) {
    const entries = Object.entries(rules);
    const activeGroups = options?.groups ?? [];

    return entries.flatMap(fieldEntry => applyFieldRules(constraints, payload, fieldEntry as FieldEntry, activeGroups));
  };
};

function resolveConstraint(
  constraintValidatorMap: ConstraintsMap,
  field: string,
  constraintName: string,
): ConstraintValidator {
  const constraintValidator = constraintValidatorMap[constraintName];

  if (!constraintValidator) {
    throw new UnknownConstraintError(field, constraintName);
  }

  return constraintValidator;
}

function applyConstraint(
  constraintValidator: ConstraintValidator,
  payload: Payload,
  field: string,
  constraintName: string,
  value: unknown,
  options: ConstraintOptions,
): ReturnType<ConstraintValidator> {
  const context: ConstraintContext = {
    path: field,
    root: payload,
    value,
    constraint: constraintName,
    options,
  };

  return constraintValidator(value, context);
}

type FieldEntry = [string, FieldRules];

function applyFieldRules(
  constraintValidatorMap: ConstraintsMap,
  payload: Payload,
  [field, fieldRules]: FieldEntry,
  activeGroups: string[],
): ReturnType<ConstraintValidator> {
  const value = payload[field];

  return Object.keys(fieldRules).flatMap(constraintName => {
    const constraintValidator = resolveConstraint(constraintValidatorMap, field, constraintName);
    const options = fieldRules[constraintName];
    const constraintGroups = options.groups ?? [];

    if (constraintGroups.length > 0 && !constraintGroups.some(group => activeGroups.includes(group))) {
      return [];
    }

    return applyConstraint(constraintValidator, payload, field, constraintName, value, options as ConstraintOptions);
  });
}
