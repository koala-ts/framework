export type Violation = {
  path: string;
  message: string;
  constraint: string;
  value: unknown;
};
