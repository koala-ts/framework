import { ConstraintSchema } from './constraint';

type FieldSchemaEntry = string | ConstraintSchema;

type FieldSchemaList = FieldSchemaEntry[];

type FieldSchemaMap = ConstraintSchema;

export type FieldSchema = FieldSchemaList | FieldSchemaMap;

export type ValidationSchema = {
  [field: string]: FieldSchema;
};
