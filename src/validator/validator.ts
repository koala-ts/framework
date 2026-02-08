import { UnknownConstraintError } from './errors';
import {
  ConstraintContext,
  ConstraintOptions,
  ConstraintsMap,
  ConstraintValidator,
  FieldRuleEntry,
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
    // If no groups are provided, implicitly validate against "Default".
    const activeGroups = options?.groups && options.groups.length > 0 ? options.groups : ['Default'];

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
  applyConstraints: ConstraintContext['applyConstraints'],
): ReturnType<ConstraintValidator> {
  const context: ConstraintContext = {
    path: field,
    root: payload,
    value,
    constraint: constraintName,
    options,
    applyConstraints,
  };

  return constraintValidator(value, context);
}

type FieldEntry = [string, FieldRules];

function applyFieldRules(
  constraintValidatorMap: ConstraintsMap,
  payload: Payload,
  [field, fieldRules]: FieldEntry,
  activeGroups: string[],
  currentValue?: unknown,
): ReturnType<ConstraintValidator> {
  const value = currentValue ?? payload[field];
  const normalizedRules = normalizeFieldRules(fieldRules);
  // Reuse the same validation pipeline for nested/compound rules.
  const applyConstraints = (nextValue: unknown, rules: FieldRules, path: string) =>
    applyFieldRules(constraintValidatorMap, payload, [path, rules], activeGroups, nextValue);

  return normalizedRules.flatMap(([constraintName, options]) => {
    const constraintValidator = resolveConstraint(constraintValidatorMap, field, constraintName);
    const constraintGroups = options?.groups ?? [];

    // Skip constraints whose groups are not active for this validation run.
    if (constraintGroups.length > 0 && !constraintGroups.some(group => activeGroups.includes(group))) {
      return [];
    }

    return applyConstraint(constraintValidator, payload, field, constraintName, value, options, applyConstraints);
  });
}

function normalizeFieldRules(fieldRules: FieldRules): Array<[string, ConstraintOptions]> {
  // Normalize rule shapes (array or map) into a consistent tuple list.
  if (Array.isArray(fieldRules)) {
    return fieldRules.flatMap(entry => normalizeFieldRuleEntry(entry));
  }

  return Object.entries(fieldRules).map(([constraintName, options]) => [constraintName, options]);
}

function normalizeFieldRuleEntry(entry: FieldRuleEntry): Array<[string, ConstraintOptions]> {
  // Convert shorthand rule declarations into a full [name, options] tuple.
  if (typeof entry === 'string') {
    return [[entry, {}]];
  }

  return Object.entries(entry).map(([constraintName, options]) => [constraintName, options]);
}
