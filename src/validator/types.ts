export type Violation = {
  path: string;
  message: string;
  constraint: string;
  value: unknown;
};

export type ConstraintOptions = { groups?: string[] } & Record<string, unknown>;
export type ConstraintContext = {
  path: string;
  root: unknown;
  value: unknown;
  constraint: string;
  options: ConstraintOptions;
  runNestedRules: (value: unknown, rules: FieldRules, path: string) => Violation[];
};

export type ConstraintValidator = (value: unknown, context: ConstraintContext) => Violation[];

export type ConstraintsMap = Record<string, ConstraintValidator>;

export type FieldRuleEntry = string | Record<string, ConstraintOptions>;

export type FieldRules = Record<string, ConstraintOptions> | FieldRuleEntry[];

export type ValidationRules = Record<string, FieldRules>;

export type ValidatorOptions = { constraints: ConstraintsMap };

export type ValidateOptions = { groups?: string[] };

export type Payload = Record<string, unknown>;

export type Validator = (payload: Payload, rules: ValidationRules, options?: ValidateOptions) => Violation[];

export type ViolationMapper = (violations: Violation[]) => Record<string, string[]>;
