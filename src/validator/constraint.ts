export type ConstraintOptions = {
  groups?: string[];
  [key: string]: unknown;
};

export type ConstraintSchema = {
  [constraint: string]: ConstraintOptions;
};
