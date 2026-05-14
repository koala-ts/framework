export type ConstraintOptions = {
  groups?: string[];
  [key: string]: unknown;
};

type ConstraintSchema = {
  [constraint: string]: ConstraintOptions;
};

type FieldSchemaEntry = string | ConstraintSchema;

type FieldSchemaList = FieldSchemaEntry[];

type FieldSchemaMap = {
  [constraint: string]: ConstraintOptions;
};

export type FieldSchema = FieldSchemaList | FieldSchemaMap;

export type ValidationSchema = {
  [field: string]: FieldSchema;
};
