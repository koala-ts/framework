export type Violation = {
  path: string;
  message: string;
  constraint: string;
  value: unknown;
};

export type ConstraintContext = {
  path: string;
  root: unknown;
  value: unknown;
  constraint: string;
};

export type ConstraintValidator = (value: unknown, context: ConstraintContext) => Violation[];

export type ConstraintsMap = Record<string, ConstraintValidator>;

export type FieldRules = Record<string, unknown>;

export type ValidationRules = Record<string, FieldRules>;

export type ValidatorOptions = { constraints: ConstraintsMap };

export type Payload = Record<string, unknown>;

export type Validator = (payload: Payload, rules: ValidationRules) => Violation[];
