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

type FieldEntry = [string, FieldRules];

export const createValidator = (options: ValidatorOptions): Validator => {
  const { constraints } = options;

  return function validate(payload: Payload, rules: ValidationRules, options?: ValidateOptions) {
    const ruleEntries: FieldEntry[] = Object.entries(rules);

    // If no groups are provided, implicitly validate against "Default".
    const activeGroups = options?.groups && options.groups.length > 0 ? options.groups : ['Default'];

    // Apply all field rules and aggregate results.
    return ruleEntries.flatMap(function (fieldEntry: FieldEntry) {
      return applyFieldRules(constraints, payload, fieldEntry, activeGroups);
    });
  };
};

function applyFieldRules(
  constraintsByName: ConstraintsMap,
  payload: Payload,
  [field, rulesForField]: FieldEntry,
  activeGroups: string[],
  currentValue?: unknown,
): ReturnType<ConstraintValidator> {
  const isGroupActive = (groups: string[]) => groups.length === 0 || groups.some(group => activeGroups.includes(group));

  const normalizedFieldRules = normalizeFieldRules(rulesForField);

  return normalizedFieldRules.flatMap(([constraintName, options]) => {
    // Check if the constraint should be applied based on groups.
    const groups = options?.groups ?? [];
    if (!isGroupActive(groups)) return [];

    // Helper function to apply nested rules.
    const applyNestedRules = (nextValue: unknown, rules: FieldRules, path: string) =>
      applyFieldRules(constraintsByName, payload, [path, rules], activeGroups, nextValue);

    // Find the constraint, build the context, and apply it.
    const constraintValidator = resolveConstraint(constraintsByName, field, constraintName);
    const value = currentValue ?? payload[field];
    const context: ConstraintContext = {
      path: field,
      root: payload,
      value,
      constraint: constraintName,
      options,
      applyConstraints: applyNestedRules,
    };

    return constraintValidator(value, context);
  });
}

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
