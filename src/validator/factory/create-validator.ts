import { UnknownConstraintError } from '../errors';
import { ConstraintContext, ConstraintValidator } from '@/validator/constraint';
import { ConstraintOptions, FieldSchema } from '@/validator/schema';
import { Validator } from '@/validator/validator';
import { Payload } from '@/validator';

type FieldSchemaEntry = [string, FieldSchema];
type ConstraintsMap = Record<string, ConstraintValidator>;
type ValidatorOptions = { constraints: ConstraintsMap };

export const createValidator = (options: ValidatorOptions): Validator => {
  const { constraints } = options;

  return function validate(payload, schema, options?) {
    const schemaEntries: FieldSchemaEntry[] = Object.entries(schema);

    // If no groups are provided, implicitly validate against "Default".
    const activeGroups = options?.groups && options.groups.length > 0 ? options.groups : ['Default'];

    // Apply all field schemas and aggregate results.
    return schemaEntries.flatMap(function (fieldSchemaEntry: FieldSchemaEntry) {
      return applyFieldSchema(constraints, payload, fieldSchemaEntry, activeGroups);
    });
  };
};

function applyFieldSchema(
  constraintsByName: ConstraintsMap,
  payload: Payload,
  [field, schemaForField]: FieldSchemaEntry,
  activeGroups: string[],
  currentValue?: unknown,
): ReturnType<ConstraintValidator> {
  const isGroupActive = (groups: string[]) => groups.length === 0 || groups.some(group => activeGroups.includes(group));

  const normalizedFieldSchema = normalizeFieldSchema(schemaForField);

  return normalizedFieldSchema.flatMap(([constraintName, options]) => {
    // Check if the constraint should be applied based on groups.
    const groups = options?.groups ?? [];
    if (!isGroupActive(groups)) return [];

    // Helper function to apply nested rules.
    const applyNestedRules = (nextValue: unknown, schema: FieldSchema, path: string) =>
      applyFieldSchema(constraintsByName, payload, [path, schema], activeGroups, nextValue);

    // Find the constraint, build the context, and apply it.
    const constraintValidator = resolveConstraint(constraintsByName, field, constraintName);
    const value = currentValue ?? payload[field];
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
): ConstraintValidator {
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
