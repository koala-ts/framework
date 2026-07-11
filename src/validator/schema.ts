import type { ConstraintSchema } from './constraint';

type FieldSchemaEntry = string | ConstraintSchema;

type FieldSchemaList = FieldSchemaEntry[];

type FieldSchemaMap = ConstraintSchema;

export type FieldSchema = FieldSchemaList | FieldSchemaMap;

export type ValidationSchema = {
  [field: string]: FieldSchema;
};

/** @deprecated Use FieldSchema instead. */
export type FieldRules = FieldSchema;

/** @deprecated Use ValidationSchema instead. */
export type ValidationRules = ValidationSchema;
