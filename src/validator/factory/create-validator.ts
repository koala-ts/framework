import type { ConstraintOptions } from '#koala/validator/constraint';
import type { ConstraintContext, ConstraintValidator } from '#koala/validator/constraint-validator';
import { UnknownConstraintError } from '#koala/validator/errors';
import type { Payload } from '#koala/validator/payload';
import type { FieldSchema } from '#koala/validator/schema';
import type { Validator } from '#koala/validator/validator';

type FieldSchemaEntry = [string, FieldSchema];
type RegisteredConstraintValidator = {
  validate(value: unknown, context: ConstraintContext): ReturnType<ConstraintValidator>;
}['validate'];
type ConstraintsMap = Record<string, RegisteredConstraintValidator>;
type ValidatorOptions = { constraints: ConstraintsMap };
type CurrentValue = { value: unknown };

export const createValidator = (options: ValidatorOptions): Validator => {
  const { constraints } = options;

  return function validate(payload, schema, options?) {
    const schemaEntries: FieldSchemaEntry[] = Object.entries(schema);

    // If no groups are provided, implicitly validate against "Default".
    const activeGroups = options?.groups && options.groups.length > 0 ? options.groups : ['Default'];

    // Apply all field schemas and aggregate results.
    return schemaEntries.flatMap((fieldSchemaEntry: FieldSchemaEntry) =>
      applyFieldSchema(constraints, payload, fieldSchemaEntry, activeGroups),
    );
  };
};

function applyFieldSchema(
  constraintsByName: ConstraintsMap,
  payload: Payload,
  [field, schemaForField]: FieldSchemaEntry,
  activeGroups: string[],
  currentValue?: CurrentValue,
): ReturnType<ConstraintValidator> {
  const isGroupActive = (groups: string[]) => groups.length === 0 || groups.some(group => activeGroups.includes(group));

  const normalizedFieldSchema = normalizeFieldSchema(schemaForField);

  return normalizedFieldSchema.flatMap(([constraintName, options]) => {
    // Check if the constraint should be applied based on groups.
    const groups = options?.groups ?? [];
    if (!isGroupActive(groups)) return [];

    // Helper function to apply nested rules.
    const applyNestedRules = (nextValue: unknown, schema: FieldSchema, path: string) =>
      applyFieldSchema(constraintsByName, payload, [path, schema], activeGroups, { value: nextValue });

    // Find the constraint, build the context, and apply it.
    const constraintValidator = resolveConstraint(constraintsByName, field, constraintName);
    const value = currentValue === undefined ? payload[field] : currentValue.value;
    const context: ConstraintContext = {
      path: field,
      root: payload,
      value,
      constraint: constraintName,
      options,
      runNestedRules: applyNestedRules,
    };

    return constraintValidator(value, context);
  });
}

function resolveConstraint(
  constraintValidatorMap: ConstraintsMap,
  field: string,
  constraintName: string,
): RegisteredConstraintValidator {
  const constraintValidator = constraintValidatorMap[constraintName];

  if (!constraintValidator) {
    throw new UnknownConstraintError(field, constraintName);
  }

  return constraintValidator;
}

function normalizeFieldSchema(fieldSchema: FieldSchema): Array<[string, ConstraintOptions]> {
  // Normalize schema shapes (array or map) into a consistent tuple list.
  if (Array.isArray(fieldSchema)) {
    return fieldSchema.flatMap(entry => normalizeFieldSchemaEntry(entry));
  }
  return Object.entries(fieldSchema).map(([constraintName, options]) => [constraintName, options]);
}

type FieldSchemaDeclaration =
  | string
  | {
      [constraint: string]: ConstraintOptions;
    };
function normalizeFieldSchemaEntry(entry: FieldSchemaDeclaration): Array<[string, ConstraintOptions]> {
  // Convert shorthand schema declarations into a full [name, options] tuple.
  if (typeof entry === 'string') {
    return [[entry, {}]];
  }

  return Object.entries(entry).map(([constraintName, options]) => [constraintName, options]);
}
