export type ConstraintOptions<TOptions extends object = { [option: string]: unknown }> = TOptions & {
  groups?: string[];
};

export type ConstraintSchema = {
  [constraint: string]: ConstraintOptions;
};
