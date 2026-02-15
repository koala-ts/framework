import { Violation } from '@/validator/types';

export function flattenViolations(violations: Violation[]): Record<string, string[]> {
  const groupedViolations = Object.groupBy(violations, violation => violation.path) as Record<string, Violation[]>;

  const violationEntries: Iterable<readonly [PropertyKey, string[]]> = Object.entries(groupedViolations).map(
    ([field, violations]) => [field, violations.map(v => v.message)],
  );

  return Object.fromEntries(violationEntries);
}
